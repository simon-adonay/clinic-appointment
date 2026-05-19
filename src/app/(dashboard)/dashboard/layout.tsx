import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { DashboardNav } from "@/components/layout/dashboard-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main className="min-h-screen bg-slate-50 lg:flex">
      <DashboardNav name={session.user.name} email={session.user.email} />
      <section className="min-w-0 flex-1 p-4 md:p-8">{children}</section>
    </main>
  );
}
