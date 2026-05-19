import { format } from "date-fns";
import { Sparkles } from "lucide-react";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { Card } from "@/components/ui/card";

export default async function AppointmentsPage() {
  const session = await auth();
  const clinicId = session?.user.clinicId;
  if (!clinicId) return null;

  const [patients, appointments] = await Promise.all([
    prisma.patient.findMany({
      where: { clinicId },
      select: { id: true, firstName: true, lastName: true },
      orderBy: [{ lastName: "asc" }]
    }),
    prisma.appointment.findMany({
      where: { clinicId },
      include: { patient: true, followUps: true },
      orderBy: { startsAt: "asc" },
      take: 50
    })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Appointments</h1>
        <p className="mt-1 text-sm text-slate-600">Schedule visits and generate follow-up reminders from the appointment context.</p>
      </div>
      <Card className="p-5">
        <h2 className="mb-4 text-lg font-bold text-ink">Schedule appointment</h2>
        <AppointmentForm patients={patients} />
      </Card>
      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-bold text-ink">Schedule</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="grid gap-3 p-5 lg:grid-cols-[180px_1fr_auto] lg:items-center">
              <div>
                <p className="font-semibold text-ink">{format(appointment.startsAt, "MMM d")}</p>
                <p className="text-sm text-slate-500">{format(appointment.startsAt, "h:mm a")}</p>
              </div>
              <div>
                <p className="font-semibold text-ink">
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </p>
                <p className="text-sm text-slate-600">{appointment.reason}</p>
                {appointment.followUps[0] ? (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{appointment.followUps[0].message}</p>
                ) : null}
              </div>
              <form action="/api/ai/follow-up-reminder" method="post">
                <input type="hidden" name="appointmentId" value={appointment.id} />
                <input type="hidden" name="tone" value="warm" />
                <button className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Sparkles size={16} />
                  Generate
                </button>
              </form>
            </div>
          ))}
          {appointments.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">No appointments yet.</p> : null}
        </div>
      </Card>
    </div>
  );
}
