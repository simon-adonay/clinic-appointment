import { Save } from "lucide-react";
import { createPatient } from "@/lib/actions/patients";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export function PatientForm() {
  return (
    <form action={createPatient} className="grid gap-4 md:grid-cols-2">
      <label className="text-sm font-medium text-slate-700">
        First name
        <Input name="firstName" className="mt-1" required />
      </label>
      <label className="text-sm font-medium text-slate-700">
        Last name
        <Input name="lastName" className="mt-1" required />
      </label>
      <label className="text-sm font-medium text-slate-700">
        Email
        <Input name="email" className="mt-1" type="email" />
      </label>
      <label className="text-sm font-medium text-slate-700">
        Phone
        <Input name="phone" className="mt-1" />
      </label>
      <label className="text-sm font-medium text-slate-700">
        Date of birth
        <Input name="dateOfBirth" className="mt-1" type="date" />
      </label>
      <label className="text-sm font-medium text-slate-700 md:col-span-2">
        Notes
        <Textarea name="notes" className="mt-1" placeholder="Care preferences, allergies, or intake notes" />
      </label>
      <div className="md:col-span-2">
        <Button>
          <Save size={16} />
          Save patient
        </Button>
      </div>
    </form>
  );
}
