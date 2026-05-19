import Link from "next/link";
import { PasswordRecoveryForm } from "@/components/auth/password-recovery-form";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md p-6">
        <Link href="/" className="text-lg font-bold text-ink">
          ClinicFlow
        </Link>
        <h1 className="mt-8 text-3xl font-bold text-ink">Recover access</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter your account email and we’ll send a one-time password reset link.
        </p>
        <div className="mt-6">
          <PasswordRecoveryForm />
        </div>
        <p className="mt-6 text-sm text-slate-600">
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-clinic-700">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
