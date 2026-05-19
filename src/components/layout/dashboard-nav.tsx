import Link from "next/link";
import { CalendarDays, CreditCard, LayoutDashboard, LogOut, UsersRound } from "lucide-react";
import { signOut } from "@/lib/auth/config";
import { initials } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/patients", label: "Patients", icon: UsersRound },
  { href: "/dashboard/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard }
];

export function DashboardNav({ name, email }: { name?: string | null; email?: string | null }) {
  return (
    <aside className="flex border-b border-slate-200 bg-white lg:min-h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-4 lg:block lg:px-6">
        <Link href="/dashboard" className="text-xl font-bold text-ink">
          ClinicFlow
        </Link>
        <div className="hidden items-center gap-3 rounded-lg bg-slate-50 p-3 lg:mt-8 lg:flex">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-clinic-100 text-sm font-bold text-clinic-700">
            {initials(name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{name ?? "Clinic user"}</p>
            <p className="truncate text-xs text-slate-500">{email}</p>
          </div>
        </div>
      </div>
      <nav className="flex flex-1 gap-1 overflow-x-auto px-2 py-2 lg:flex-col lg:px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-ink"
          >
            <item.icon size={17} />
            {item.label}
          </Link>
        ))}
      </nav>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
        className="hidden p-4 lg:block"
      >
        <Button variant="ghost" className="w-full justify-start">
          <LogOut size={16} />
          Sign out
        </Button>
      </form>
    </aside>
  );
}
