"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { sendPasswordRecoveryEmail } from "@/lib/email/password-recovery";
import { passwordRecoverySchema, passwordResetSchema, registerSchema } from "@/lib/validators/clinic";
import { slugify } from "@/lib/utils";

const RESET_TOKEN_TTL_MS = 1000 * 60 * 30;

type RecoveryState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function registerClinic(formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Invalid registration details.");
  }

  const { clinicName, name, email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("An account already exists for this email.");

  const slugBase = slugify(clinicName);
  const slug = `${slugBase}-${Math.random().toString(36).slice(2, 7)}`;
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.clinic.create({
    data: {
      name: clinicName,
      slug,
      users: {
        create: {
          name,
          email,
          passwordHash,
          role: "ADMIN"
        }
      }
    }
  });

  redirect("/login?registered=1");
}

export async function requestPasswordRecovery(_state: RecoveryState, formData: FormData): Promise<RecoveryState> {
  const parsed = passwordRecoverySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: parsed.error.errors[0]?.message ?? "Enter a valid email address." };
  }

  const { email } = parsed.data;
  const genericMessage = "If an account exists for that email, a reset link has been sent.";
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { status: "success", message: genericMessage };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const passwordResetExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpires
    }
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;
  await sendPasswordRecoveryEmail({ to: email, resetUrl });

  return { status: "success", message: genericMessage };
}

export async function resetPassword(_state: RecoveryState, formData: FormData): Promise<RecoveryState> {
  const parsed = passwordResetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: parsed.error.errors[0]?.message ?? "Invalid reset request." };
  }

  const hashedToken = crypto.createHash("sha256").update(parsed.data.token).digest("hex");
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { gt: new Date() }
    }
  });

  if (!user) {
    return { status: "error", message: "This reset link is invalid or expired." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null
    }
  });

  return { status: "success", message: "Password updated. You can sign in with your new password." };
}
