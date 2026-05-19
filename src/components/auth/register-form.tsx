"use client";

import { useFormStatus } from "react-dom";
import { Building2, UserPlus } from "lucide-react";
import { registerClinic } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" disabled={pending}>
      <UserPlus size={16} />
      {pending ? "Creating account..." : "Create clinic"}
    </Button>
  );
}

export function RegisterForm() {
  return (
    <form action={registerClinic} className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        Clinic name
        <Input name="clinicName" className="mt-1" placeholder="Northside Family Care" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Your name
        <Input name="name" className="mt-1" placeholder="Avery Chen" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Email
        <Input name="email" className="mt-1" type="email" placeholder="you@clinic.com" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Password
        <Input name="password" className="mt-1" type="password" minLength={8} required />
      </label>
      <SubmitButton />
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Building2 size={14} />
        Workspace, patients, and billing profile are provisioned together.
      </div>
    </form>
  );
}
