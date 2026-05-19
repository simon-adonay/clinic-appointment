import type { Patient } from "@prisma/client";
import { CalendarPlus } from "lucide-react";
import { createAppointment } from "@/lib/actions/appointments";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export function AppointmentForm({ patients }: { patients: Pick<Patient, "id" | "firstName" | "lastName">[] }) {
  return (
    <form action={createAppointment} className="grid gap-4 md:grid-cols-2">
      <label className="text-sm font-medium text-slate-700 md:col-span-2">
        Patient
        <select
          name="patientId"
          className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-clinic-500 focus:ring-2 focus:ring-clinic-100"
          required
        >
          <option value="">Select patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.firstName} {patient.lastName}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium text-slate-700">
        Starts at
        <Input name="startsAt" className="mt-1" type="datetime-local" required />
      </label>
      <label className="text-sm font-medium text-slate-700">
        Duration
        <select
          name="durationMinutes"
          className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-clinic-500 focus:ring-2 focus:ring-clinic-100"
          defaultValue="30"
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">60 minutes</option>
        </select>
      </label>
      <label className="text-sm font-medium text-slate-700 md:col-span-2">
        Reason
        <Input name="reason" className="mt-1" placeholder="Follow-up consultation" required />
      </label>
      <label className="text-sm font-medium text-slate-700 md:col-span-2">
        Notes
        <Textarea name="notes" className="mt-1" />
      </label>
      <div className="md:col-span-2">
        <Button>
          <CalendarPlus size={16} />
          Schedule appointment
        </Button>
      </div>
    </form>
  );
}
