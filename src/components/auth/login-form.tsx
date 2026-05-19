"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false
          });
          if (result?.error) {
            setError("Check your email and password, then try again.");
            return;
          }
          window.location.href = "/dashboard";
        });
      }}
    >
      <label className="block text-sm font-medium text-slate-700">
        Email
        <Input name="email" className="mt-1" type="email" placeholder="you@clinic.com" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Password
        <Input name="password" className="mt-1" type="password" required />
      </label>
      <div className="text-right">
        <Link href="/forgot-password" className="text-sm font-semibold text-clinic-700">
          Forgot password?
        </Link>
      </div>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <Button className="w-full" disabled={isPending}>
        <LogIn size={16} />
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
