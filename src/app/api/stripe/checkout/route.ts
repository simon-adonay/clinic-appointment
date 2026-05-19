import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getStripe } from "@/lib/billing/stripe";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user.clinicId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clinic = await prisma.clinic.findUnique({ where: { id: session.user.clinicId } });
  if (!clinic) return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
  if (!process.env.STRIPE_PRICE_ID) return NextResponse.json({ error: "Missing STRIPE_PRICE_ID" }, { status: 500 });

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const customerId =
    clinic.stripeCustomerId ??
    (
      await stripe.customers.create({
        name: clinic.name,
        email: session.user.email ?? undefined,
        metadata: { clinicId: clinic.id }
      })
    ).id;

  if (!clinic.stripeCustomerId) {
    await prisma.clinic.update({ where: { id: clinic.id }, data: { stripeCustomerId: customerId } });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${appUrl}/dashboard/billing?checkout=success`,
    cancel_url: `${appUrl}/dashboard/billing?checkout=cancelled`,
    metadata: { clinicId: clinic.id }
  });

  return NextResponse.redirect(checkout.url ?? `${appUrl}/dashboard/billing`, { status: 303 });
}
