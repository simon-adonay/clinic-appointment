import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { getOpenAI, reminderModel } from "@/lib/openai/client";
import { followUpSchema } from "@/lib/validators/clinic";

function fallbackReminder(patientName: string, reason: string) {
  return {
    subject: `Follow-up for ${reason}`,
    message: `Hi ${patientName}, we hope you are doing well after your recent ${reason.toLowerCase()}. Please contact the clinic if symptoms change or if you have questions about your care plan.`,
    recommendedAt: addDays(new Date(), 2).toISOString()
  };
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user.clinicId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contentType = request.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries(await request.formData());

  const parsed = followUpSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const appointment = await prisma.appointment.findFirst({
    where: { id: parsed.data.appointmentId, clinicId: session.user.clinicId },
    include: { patient: true, clinic: true }
  });
  if (!appointment) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });

  const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
  let reminder = fallbackReminder(patientName, appointment.reason);

  if (process.env.OPENAI_API_KEY) {
    const openai = getOpenAI();
    const response = await openai.responses.create({
      model: reminderModel,
      input: [
        {
          role: "system",
          content:
            "You write HIPAA-conscious clinic follow-up reminders. Avoid diagnosis claims, keep content brief, and return strict JSON."
        },
        {
          role: "user",
          content: JSON.stringify({
            clinic: appointment.clinic.name,
            patientName,
            appointmentReason: appointment.reason,
            appointmentNotes: appointment.notes,
            tone: parsed.data.tone,
            outputShape: {
              subject: "short email or SMS subject",
              message: "patient-facing reminder under 90 words",
              recommendedAt: "ISO date for when staff should send it"
            }
          })
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "follow_up_reminder",
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["subject", "message", "recommendedAt"],
            properties: {
              subject: { type: "string" },
              message: { type: "string" },
              recommendedAt: { type: "string" }
            }
          }
        }
      }
    });

    const output = response.output_text ? JSON.parse(response.output_text) : reminder;
    reminder = {
      subject: String(output.subject),
      message: String(output.message),
      recommendedAt: String(output.recommendedAt)
    };
  }

  const saved = await prisma.followUpReminder.create({
    data: {
      clinicId: session.user.clinicId,
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      subject: reminder.subject,
      message: reminder.message,
      recommendedAt: new Date(reminder.recommendedAt),
      generatedByAi: Boolean(process.env.OPENAI_API_KEY)
    }
  });

  revalidatePath("/dashboard/appointments");
  if (contentType.includes("application/json")) return NextResponse.json({ reminder: saved }, { status: 201 });
  return NextResponse.redirect(new URL("/dashboard/appointments", request.url), { status: 303 });
}
