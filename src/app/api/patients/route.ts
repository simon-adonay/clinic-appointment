import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { patientSchema } from "@/lib/validators/clinic";

export async function GET() {
  const session = await auth();
  if (!session?.user.clinicId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const patients = await prisma.patient.findMany({
    where: { clinicId: session.user.clinicId },
    orderBy: [{ updatedAt: "desc" }]
  });

  return NextResponse.json({ patients });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user.clinicId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = patientSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const patient = await prisma.patient.create({
    data: {
      clinicId: session.user.clinicId,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null,
      notes: parsed.data.notes || null
    }
  });

  return NextResponse.json({ patient }, { status: 201 });
}
