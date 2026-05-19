import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getStripe } from "@/lib/billing/stripe";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user.clinicId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clinic = await prisma.clinic.findUnique({ where: { id: session.user.clinicId } });
  if (!clinic?.stripeCustomerId) return NextResponse.redirect(new URL("/dashboard/billing", request.url), { status: 303 });

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const portal = await stripe.billingPortal.sessions.create({
    customer: clinic.stripeCustomerId,
    return_url: `${appUrl}/dashboard/billing`
  });

  return NextResponse.redirect(portal.url, { status: 303 });
}
