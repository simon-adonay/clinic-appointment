"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Mail } from "lucide-react";
import { requestPasswordRecovery } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState = { status: "idle" as const, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" disabled={pending}>
      <Mail size={16} />
      {pending ? "Sending link..." : "Send reset link"}
    </Button>
  );
}

export function PasswordRecoveryForm() {
  const [state, action] = useActionState(requestPasswordRecovery, initialState);

  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        Email
        <Input name="email" className="mt-1" type="email" placeholder="you@clinic.com" required />
      </label>
      {state.message ? (
        <p className={state.status === "error" ? "text-sm font-medium text-red-600" : "text-sm font-medium text-clinic-700"}>
          {state.message}
        </p>
      ) : null}
      {state.resetUrl ? (
        <div className="rounded-md border border-clinic-100 bg-clinic-50 p-3 text-sm">
          <p className="font-semibold text-clinic-700">Development reset link</p>
          <a className="mt-1 block break-all text-clinic-700 underline" href={state.resetUrl}>
            {state.resetUrl}
          </a>
        </div>
      ) : null}
      <SubmitButton />
    </form>
  );
}
