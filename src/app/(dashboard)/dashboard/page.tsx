import { format } from "date-fns";
import { CalendarDays, Sparkles, UsersRound, WalletCards } from "lucide-react";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";

export default async function DashboardPage() {
  const session = await auth();
  const clinicId = session?.user.clinicId;
  if (!clinicId) return null;

  const [clinic, patientCount, todayCount, upcomingAppointments, reminders] = await Promise.all([
    prisma.clinic.findUnique({ where: { id: clinicId } }),
    prisma.patient.count({ where: { clinicId } }),
    prisma.appointment.count({
      where: {
        clinicId,
        startsAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    }),
    prisma.appointment.findMany({
      where: { clinicId, startsAt: { gte: new Date() } },
      include: { patient: true },
      orderBy: { startsAt: "asc" },
      take: 5
    }),
    prisma.followUpReminder.count({ where: { clinicId } })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-clinic-700">{clinic?.name}</p>
        <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Patients" value={patientCount} icon={UsersRound} />
        <StatCard label="Today" value={todayCount} icon={CalendarDays} />
        <StatCard label="AI reminders" value={reminders} icon={Sparkles} />
        <StatCard label="Billing" value={clinic?.billingStatus ?? "NONE"} icon={WalletCards} />
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Upcoming appointments</h2>
          <span className="text-sm font-semibold text-slate-500">{upcomingAppointments.length} next</span>
        </div>
        <div className="divide-y divide-slate-100">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="grid gap-2 py-4 md:grid-cols-[180px_1fr_auto] md:items-center">
              <p className="text-sm font-semibold text-slate-500">{format(appointment.startsAt, "MMM d, h:mm a")}</p>
              <div>
                <p className="font-semibold text-ink">
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </p>
                <p className="text-sm text-slate-500">{appointment.reason}</p>
              </div>
              <span className="w-fit rounded-md bg-clinic-100 px-2.5 py-1 text-xs font-bold text-clinic-700">
                {appointment.status}
              </span>
            </div>
          ))}
          {upcomingAppointments.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No upcoming appointments yet.</p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
