import Link from "next/link";
import { PasswordResetForm } from "@/components/auth/password-reset-form";
import { Card } from "@/components/ui/card";

export default async function ResetPasswordPage({ searchParams }: { searchParams?: Promise<{ token?: string }> }) {
  const params = await searchParams;
  const token = params?.token ?? "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md p-6">
        <Link href="/" className="text-lg font-bold text-ink">
          ClinicFlow
        </Link>
        <h1 className="mt-8 text-3xl font-bold text-ink">Reset password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Choose a new password for your clinic account.</p>
        <div className="mt-6">
          {token ? (
            <PasswordResetForm token={token} />
          ) : (
            <p className="text-sm font-medium text-red-600">This reset link is missing a token.</p>
          )}
        </div>
        <p className="mt-6 text-sm text-slate-600">
          Need a new link?{" "}
          <Link href="/forgot-password" className="font-semibold text-clinic-700">
            Request password recovery
          </Link>
        </p>
      </Card>
    </main>
  );
}
