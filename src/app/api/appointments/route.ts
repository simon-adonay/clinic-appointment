import { addMinutes } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { appointmentSchema } from "@/lib/validators/clinic";

export async function GET() {
  const session = await auth();
  if (!session?.user.clinicId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const appointments = await prisma.appointment.findMany({
    where: { clinicId: session.user.clinicId },
    include: { patient: true, followUps: true },
    orderBy: { startsAt: "asc" }
  });

  return NextResponse.json({ appointments });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user.clinicId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const startsAt = new Date(parsed.data.startsAt);
  const appointment = await prisma.appointment.create({
    data: {
      clinicId: session.user.clinicId,
      patientId: parsed.data.patientId,
      startsAt,
      endsAt: addMinutes(startsAt, parsed.data.durationMinutes),
      reason: parsed.data.reason,
      notes: parsed.data.notes || null
    }
  });

  return NextResponse.json({ appointment }, { status: 201 });
}
