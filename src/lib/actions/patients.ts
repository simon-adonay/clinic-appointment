"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { patientSchema } from "@/lib/validators/clinic";

export async function createPatient(formData: FormData) {
  const session = await auth();
  if (!session?.user.clinicId) throw new Error("Unauthorized");

  const parsed = patientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.errors[0]?.message ?? "Invalid patient.");

  await prisma.patient.create({
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

  revalidatePath("/dashboard/patients");
  revalidatePath("/dashboard");
}
