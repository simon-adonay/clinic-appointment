import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md p-6">
        <Link href="/" className="text-lg font-bold text-ink">
          ClinicFlow
        </Link>
        <h1 className="mt-8 text-3xl font-bold text-ink">Create your clinic</h1>
        <p className="mt-2 text-sm text-slate-600">Start with patient management, scheduling, AI reminders, and billing.</p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-clinic-700">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
