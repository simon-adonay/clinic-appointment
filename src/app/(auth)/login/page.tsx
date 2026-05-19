import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ registered?: string }> }) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md p-6">
        <Link href="/" className="text-lg font-bold text-ink">
          ClinicFlow
        </Link>
        <h1 className="mt-8 text-3xl font-bold text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">
          {params?.registered ? "Your clinic is ready. Sign in to continue." : "Sign in to manage your clinic."}
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-6 text-sm text-slate-600">
          New clinic?{" "}
          <Link href="/register" className="font-semibold text-clinic-700">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  );
}
