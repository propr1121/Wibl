import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeKey, {
    apiVersion: '2025-01-27.acacia' as any, // latest stable
    appInfo: {
        name: 'Wibl Platform',
        version: '0.1.0',
    },
});
