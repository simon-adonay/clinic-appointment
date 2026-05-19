"use server";

import { addMinutes } from "date-fns";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { appointmentSchema } from "@/lib/validators/clinic";

export async function createAppointment(formData: FormData) {
  const session = await auth();
  if (!session?.user.clinicId) throw new Error("Unauthorized");

  const parsed = appointmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.errors[0]?.message ?? "Invalid appointment.");

  const startsAt = new Date(parsed.data.startsAt);
  const endsAt = addMinutes(startsAt, parsed.data.durationMinutes);

  const patient = await prisma.patient.findFirst({
    where: { id: parsed.data.patientId, clinicId: session.user.clinicId }
  });
  if (!patient) throw new Error("Patient not found.");

  await prisma.appointment.create({
    data: {
      clinicId: session.user.clinicId,
      patientId: patient.id,
      startsAt,
      endsAt,
      reason: parsed.data.reason,
      notes: parsed.data.notes || null
    }
  });

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
}
