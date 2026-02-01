import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'No signature provided' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
        console.error('Webhook signature verification failed:', error);
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.user_id;
                const planName = session.metadata?.plan_name;

                if (!userId) {
                    console.error('No user_id in session metadata');
                    break;
                }

                // Update user's subscription in database
                const { error } = await supabase
                    .from('subscriptions')
                    .upsert({
                        user_id: userId,
                        stripe_customer_id: session.customer as string,
                        stripe_subscription_id: session.subscription as string,
                        plan_name: planName,
                        status: 'active',
                        current_period_start: new Date(
                            (session as any).subscription_details?.current_period_start || Date.now()
                        ).toISOString(),
                        current_period_end: new Date(
                            (session as any).subscription_details?.current_period_end || Date.now()
                        ).toISOString(),
                    });

                if (error) {
                    console.error('Error updating subscription:', error);
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const userId = subscription.metadata?.user_id;

                if (!userId) {
                    console.error('No user_id in subscription metadata');
                    break;
                }

                // Update subscription status
                const { error } = await supabase
                    .from('subscriptions')
                    .update({
                        status: subscription.status,
                        current_period_start: new Date(
                            subscription.current_period_start * 1000
                        ).toISOString(),
                        current_period_end: new Date(
                            subscription.current_period_end * 1000
                        ).toISOString(),
                        cancel_at_period_end: subscription.cancel_at_period_end,
                    })
                    .eq('stripe_subscription_id', subscription.id);

                if (error) {
                    console.error('Error updating subscription:', error);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;

                // Mark subscription as cancelled
                const { error } = await supabase
                    .from('subscriptions')
                    .update({
                        status: 'cancelled',
                        cancelled_at: new Date().toISOString(),
                    })
                    .eq('stripe_subscription_id', subscription.id);

                if (error) {
                    console.error('Error cancelling subscription:', error);
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                const subscriptionId = invoice.subscription as string;

                // Update subscription status to past_due
                const { error } = await supabase
                    .from('subscriptions')
                    .update({
                        status: 'past_due',
                    })
                    .eq('stripe_subscription_id', subscriptionId);

                if (error) {
                    console.error('Error updating failed payment:', error);
                }

                // Optionally: Send email notification to user
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

// Disable body parsing for Stripe webhooks
export const config = {
    api: {
        bodyParser: false,
    },
};
