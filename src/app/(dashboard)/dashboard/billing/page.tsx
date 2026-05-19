import { CreditCard, ExternalLink } from "lucide-react";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function BillingPage() {
  const session = await auth();
  const clinicId = session?.user.clinicId;
  if (!clinicId) return null;

  const clinic = await prisma.clinic.findUnique({ where: { id: clinicId } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Billing</h1>
        <p className="mt-1 text-sm text-slate-600">Stripe subscription checkout and portal integration.</p>
      </div>
      <Card className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-500">Current plan</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">{clinic?.billingStatus ?? "NONE"}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Use checkout for new subscriptions and the customer portal for plan changes, payment methods, and invoices.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <form action="/api/stripe/checkout" method="post">
              <Button>
                <CreditCard size={16} />
                Subscribe
              </Button>
            </form>
            <form action="/api/stripe/portal" method="post">
              <Button variant="secondary">
                <ExternalLink size={16} />
                Billing portal
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
