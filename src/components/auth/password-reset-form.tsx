"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { KeyRound } from "lucide-react";
import { resetPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState = { status: "idle" as const, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" disabled={pending}>
      <KeyRound size={16} />
      {pending ? "Updating password..." : "Update password"}
    </Button>
  );
}

export function PasswordResetForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPassword, initialState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <label className="block text-sm font-medium text-slate-700">
        New password
        <Input name="password" className="mt-1" type="password" minLength={8} required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Confirm password
        <Input name="confirmPassword" className="mt-1" type="password" minLength={8} required />
      </label>
      {state.message ? (
        <p className={state.status === "error" ? "text-sm font-medium text-red-600" : "text-sm font-medium text-clinic-700"}>
          {state.message}
        </p>
      ) : null}
      {state.status === "success" ? (
        <Link href="/login">
          <Button type="button" variant="secondary" className="w-full">
            Back to sign in
          </Button>
        </Link>
      ) : (
        <SubmitButton />
      )}
    </form>
  );
}
