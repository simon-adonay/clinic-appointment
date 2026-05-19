import Link from "next/link";
import { ArrowRight, CalendarCheck, CreditCard, Sparkles, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: UsersRound, label: "Patients", text: "A clean chart-lite patient directory with notes and contact history." },
  { icon: CalendarCheck, label: "Scheduling", text: "Book visits, track status, and keep the day’s work visible." },
  { icon: Sparkles, label: "AI follow-ups", text: "Generate patient-specific reminders after each appointment." },
  { icon: CreditCard, label: "Billing", text: "Stripe checkout, portal, and webhook-ready subscription state." }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eefcf8_0%,#f7fafc_42%,#ffffff_100%)]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-ink">
            ClinicFlow
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-2 text-sm font-semibold text-slate-700">
              Sign in
            </Link>
            <Link href="/register">
              <Button>Start trial</Button>
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_0.9fr]">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-clinic-700">Clinic SaaS starter</p>
            <h1 className="text-5xl font-bold leading-tight tracking-normal text-ink md:text-7xl">
              ClinicFlow appointment operations.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A production-oriented Next.js foundation for clinics: auth, dashboards, patients, scheduling,
              AI-generated follow-up reminders, Prisma/PostgreSQL persistence, and Stripe billing.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register">
                <Button className="w-full sm:w-auto">
                  Build workspace
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Open dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white bg-white/85 p-5 shadow-panel backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">Today</p>
                <h2 className="text-2xl font-bold text-ink">Appointments</h2>
              </div>
              <span className="rounded-md bg-clinic-100 px-3 py-1 text-sm font-semibold text-clinic-700">12 booked</span>
            </div>
            <div className="space-y-3">
              {["Maya Patel", "Jordan Ellis", "Noah Brooks"].map((name, index) => (
                <div key={name} className="grid grid-cols-[72px_1fr_auto] items-center gap-3 rounded-md border border-slate-100 p-3">
                  <span className="text-sm font-bold text-slate-500">{9 + index}:00</span>
                  <div>
                    <p className="font-semibold text-ink">{name}</p>
                    <p className="text-sm text-slate-500">{index === 1 ? "Lab review" : "Follow-up visit"}</p>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-clinic-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 pb-6 md:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.label} className="rounded-lg border border-slate-200 bg-white p-4">
              <feature.icon className="mb-3 text-clinic-600" size={20} />
              <h3 className="font-bold text-ink">{feature.label}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
