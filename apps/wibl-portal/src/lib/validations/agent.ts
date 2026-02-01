import { z } from 'zod';

export const agentPersonalitySchema = z.object({
    tone: z.string().min(1, "Tone is required"),
    customTraits: z.array(z.string()),
    greetingMessage: z.string().min(1, "Greeting message is required"),
});

export const agentCapabilitiesSchema = z.object({
    allowedActions: z.array(z.string()),
    restrictedTopics: z.array(z.string()),
});

export const agentContextRulesSchema = z.object({
    systemPromptAdditions: z.string(),
    responseFormat: z.enum(['conversational', 'concise', 'technical']),
    maxTokens: z.number().int().min(1).max(4000),
});

export const agentDeploymentSchema = z.object({
    status: z.enum(['draft', 'active', 'paused', 'archived']),
    channels: z.array(z.string()),
    gatewayUrl: z.string().url().nullable(),
    deployedAt: z.string().datetime().nullable(),
});

export const agentSecuritySchema = z.object({
    inputSanitization: z.boolean(),
    outputValidation: z.boolean(),
    promptInjectionProtection: z.enum(['none', 'basic', 'strict']),
    piiRedaction: z.boolean(),
    rateLimits: z.object({
        requestsPerMinute: z.number().int().min(1),
        tokensPerHour: z.number().int().min(1),
    }),
});

export const createAgentSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().max(500).optional().nullable(),
    avatar_url: z.string().url().optional().nullable(),
    personality: agentPersonalitySchema,
    capabilities: agentCapabilitiesSchema,
    knowledge_source_ids: z.array(z.string().uuid()),
    tool_connection_ids: z.array(z.string().uuid()),
    context_rules: agentContextRulesSchema,
    deployment: agentDeploymentSchema,
    security: agentSecuritySchema,
});

export const updateAgentSchema = createAgentSchema.partial();
