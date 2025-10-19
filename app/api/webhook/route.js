import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose"
import User from "@/models/User";

export async function POST(request) {
    // 1. Verify the webhook signature
    try {
    
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const body = await request.text();
        const signature = headers().get("stripe-signature");
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

        const { data, type } = event;

        if (type == "checkout.session.completed") {
            await connectMongo();

            const user = await User.findById(data.object.client_reference_id);

            console.log("User fetched from DB:", user);

            user.hasAccess = true;
            user.customerId = data.object.customer;
            await user.save();
        } else if (type === "customer.subscription.deleted") {
            await connectMongo();

            const user = await User.findOne({ customerId: data.object.customer });

            if (!user) {
                console.warn("No user for customer", data.object.customer);
                return NextResponse.json({});
            }

            user.hasAccess = false;

            await user.save();

            console.log(user)
            console.log("Updated hasAccess:", user.hasAccess);
        }
    } catch (error) {
        console.error("Stripe error:", error?.message);
        
    }

    return NextResponse.json({});
    // 2. Update user in our database
    // 3. Respond to the webhook
}

