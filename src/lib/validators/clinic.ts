import { z } from "zod";

export const registerSchema = z.object({
  clinicName: z.string().min(2, "Clinic name is required").max(120),
  name: z.string().min(2, "Your name is required").max(120),
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const passwordRecoverySchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase())
});

export const passwordResetSchema = z
  .object({
    token: z.string().min(32),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters")
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const patientSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional(),
  dateOfBirth: z.string().optional(),
  notes: z.string().max(4000).optional()
});

export const appointmentSchema = z.object({
  patientId: z.string().min(1),
  startsAt: z.string().min(1),
  durationMinutes: z.coerce.number().int().min(10).max(240),
  reason: z.string().min(2).max(200),
  notes: z.string().max(4000).optional()
});

export const followUpSchema = z.object({
  appointmentId: z.string().min(1),
  tone: z.enum(["warm", "concise", "formal"]).default("warm")
});
