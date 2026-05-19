import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/billing/stripe";
import { prisma } from "@/lib/db/prisma";

function mapStatus(status: Stripe.Subscription.Status) {
  if (status === "trialing") return "TRIALING";
  if (status === "active") return "ACTIVE";
  if (status === "past_due" || status === "unpaid") return "PAST_DUE";
  if (status === "canceled" || status === "incomplete_expired") return "CANCELED";
  return "NONE";
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clinicId = session.metadata?.clinicId;
    if (clinicId && session.subscription && session.customer) {
      await prisma.clinic.update({
        where: { id: clinicId },
        data: {
          stripeCustomerId: String(session.customer),
          stripeSubscriptionId: String(session.subscription),
          billingStatus: "ACTIVE"
        }
      });
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await prisma.clinic.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        stripePriceId: subscription.items.data[0]?.price.id,
        billingStatus: mapStatus(subscription.status)
      }
    });
  }

  return NextResponse.json({ received: true });
}
