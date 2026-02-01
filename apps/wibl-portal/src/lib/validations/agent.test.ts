import { describe, it, expect } from 'vitest';
import { createAgentSchema } from './agent';

describe('Agent Validation Schema', () => {
    const validAgent = {
        name: 'Test Agent',
        description: 'A test agent',
        personality: {
            tone: 'friendly',
            customTraits: ['helpful'],
            greetingMessage: 'Hello!',
        },
        capabilities: {
            allowedActions: ['chat'],
            restrictedTopics: ['politics'],
        },
        knowledge_source_ids: ['d290f1ee-6c54-4b01-90e6-d701748f0851'],
        tool_connection_ids: ['d290f1ee-6c54-4b01-90e6-d701748f0852'],
        context_rules: {
            systemPromptAdditions: 'Be nice',
            responseFormat: 'conversational' as const,
            maxTokens: 1000,
        },
        deployment: {
            status: 'draft' as const,
            channels: ['web'],
            gatewayUrl: null,
            deployedAt: null,
        },
        security: {
            inputSanitization: true,
            outputValidation: true,
            promptInjectionProtection: 'strict' as const,
            piiRedaction: false,
            rateLimits: {
                requestsPerMinute: 20,
                tokensPerHour: 10000,
            },
        },
    };

    it('validates a correct agent object', () => {
        const result = createAgentSchema.safeParse(validAgent);
        expect(result.success).toBe(true);
    });

    it('fails if name is missing', () => {
        const invalidAgent = { ...validAgent, name: '' };
        const result = createAgentSchema.safeParse(invalidAgent);
        expect(result.success).toBe(false);
    });

    it('fails if personality is invalid', () => {
        const invalidAgent = {
            ...validAgent,
            personality: { ...validAgent.personality, tone: '' },
        };
        const result = createAgentSchema.safeParse(invalidAgent);
        expect(result.success).toBe(false);
    });

    it('fails if maxTokens is out of range', () => {
        const invalidAgent = {
            ...validAgent,
            context_rules: { ...validAgent.context_rules, maxTokens: 5000 },
        };
        const result = createAgentSchema.safeParse(invalidAgent);
        expect(result.success).toBe(false);
    });
});
