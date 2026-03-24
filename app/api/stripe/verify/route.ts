import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ active: false });
    }

    // Also allow access code as fallback
    const accessCode = process.env.ACCESS_CODE;
    if (accessCode && email === accessCode) {
      return NextResponse.json({ active: true });
    }

    const stripe = getStripe();
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) {
      return NextResponse.json({ active: false });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: "active",
      limit: 1,
    });

    return NextResponse.json({ active: subscriptions.data.length > 0 });
  } catch (error) {
    console.error("Stripe verify error:", error);
    return NextResponse.json({ active: false });
  }
}
