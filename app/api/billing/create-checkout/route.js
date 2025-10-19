import { NextResponse } from 'next/server';
import { auth } from "@/auth"
import connectMongo from '@/libs/mongoose';
import User from '@/models/User';
import Stripe from 'stripe';

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.success_url || !body.cancel_url) {
      return NextResponse.json(
        { error: "Success and cancel URLs are required" },
        { status: 400 }
      );
    }

    const session = await auth();

    await connectMongo();

    const user = await User.findById(session.user.id);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
        }],
        success_url: body.success_url,
        cancel_url: body.cancel_url,
        customer_email: user.email,
        client_reference_id: user._id.toString(),
    });

    return NextResponse.json({ url: stripeCheckoutSession.url });

  } catch (e) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
  
}