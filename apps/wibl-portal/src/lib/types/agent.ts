export type AgentStatus = 'draft' | 'active' | 'paused' | 'archived';

export interface AgentPersonality {
    tone: string;
    customTraits: string[];
    greetingMessage: string;
}

export interface AgentCapabilities {
    allowedActions: string[];
    restrictedTopics: string[];
}

export interface AgentContextRules {
    systemPromptAdditions: string;
    responseFormat: 'conversational' | 'concise' | 'technical';
    maxTokens: number;
}

export interface AgentDeployment {
    status: AgentStatus;
    channels: string[];
    gatewayUrl: string | null;
    deployedAt: string | null;
}

export interface AgentSecurity {
    inputSanitization: boolean;
    outputValidation: boolean;
    promptInjectionProtection: 'none' | 'basic' | 'strict';
    piiRedaction: boolean;
    rateLimits: {
        requestsPerMinute: number;
        tokensPerHour: number;
    };
}

export interface AgentStats {
    totalConversations: number;
    avgResponseTime: number;
    lastActiveAt: string | null;
}

export interface Agent {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    avatar_url: string | null;
    personality: AgentPersonality;
    capabilities: AgentCapabilities;
    knowledge_source_ids: string[];
    tool_connection_ids: string[];
    context_rules: AgentContextRules;
    deployment: AgentDeployment;
    security: AgentSecurity;
    stats: AgentStats;
    created_at: string;
    updated_at: string;
}

export type CreateAgentInput = Omit<Agent, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'stats'>;
export type UpdateAgentInput = Partial<CreateAgentInput>;
