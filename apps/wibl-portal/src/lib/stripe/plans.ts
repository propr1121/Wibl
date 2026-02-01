export const PLANS = {
    starter: {
        name: 'Starter',
        price: 9900, // €99 in cents
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
        agents: 1,
        tools: 0,
        features: ['1 AI Agent', 'Web widget deployment', 'Basic analytics', 'Email support'],
        popular: false,
    },
    pro: {
        name: 'Pro',
        price: 19900, // €199
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
        agents: 3,
        tools: 3,
        features: ['3 AI Agents', 'All channels', '3 tool integrations', 'Advanced analytics', 'Priority support'],
        popular: true, // Highlighted with gradient border
    },
    business: {
        name: 'Business',
        price: 29900, // €299
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS,
        agents: 10,
        tools: 5,
        features: ['10 AI Agents', 'All channels', '5 tool integrations', 'Custom branding', 'API access', 'Dedicated support'],
        popular: false,
    },
    enterprise: {
        name: 'Enterprise',
        price: null,
        priceId: null,
        agents: Infinity,
        tools: Infinity,
        features: ['Unlimited agents', 'Unlimited tools', 'SSO/SAML', 'SLA', 'Custom integrations', 'Dedicated success manager'],
        popular: false,
    },
};

export type PlanKey = keyof typeof PLANS;
