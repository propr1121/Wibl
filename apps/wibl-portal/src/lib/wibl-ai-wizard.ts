import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Load the comprehensive Wibl knowledge base
const WIBL_KNOWLEDGE = fs.readFileSync(
    path.join(process.cwd(), 'src/lib/wibl-ai-knowledge.md'),
    'utf-8'
);

export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface AgentConfig {
    name?: string;
    purpose?: string;
    description?: string;
    personality?: 'professional' | 'friendly' | 'casual' | 'custom';
    personalityDetail?: string;
    knowledgeSources?: Array<{
        type: 'url' | 'text' | 'file';
        content: string;
        priority: number;
    }>;
    channels?: string[];
    primaryChannel?: string;
    escalationRules?: string;
    handoffEnabled?: boolean;
    responseTime?: 'instant' | 'natural';
    responseStyle?: 'conversational' | 'concise' | 'technical';
    safetySettings?: string[];
    integrations?: {
        calendar?: string;
        crm?: string;
        payment?: string;
        custom?: string[];
    };
    businessHours?: string;
    fallbackBehavior?: string;
    complianceRequirements?: string[];
}

export interface WizardState {
    conversationHistory: ConversationMessage[];
    extractedConfig: AgentConfig;
    isComplete: boolean;
    currentPhase: 'discovery' | 'configuration' | 'validation' | 'complete';
}

/**
 * AI-Driven Conversational Wizard
 * Uses Claude to conduct natural conversation and extract structured agent configuration
 */
export class WiblAIWizard {
    private conversationHistory: Anthropic.MessageParam[] = [];
    private extractedConfig: AgentConfig = {};

    constructor(private userId: string) { }

    /**
     * Start the conversation or continue with user input
     */
    async chat(userMessage?: string): Promise<{
        message: string;
        extractedData?: Partial<AgentConfig>;
        isComplete: boolean;
        phase: string;
    }> {
        // Add user message to history if provided
        if (userMessage) {
            // 1. Pre-process for gibberish/keyboard mashing
            if (this.isGibberish(userMessage)) {
                const rejection = "I'm sorry, I couldn't quite catch that. To build the perfect agent, I need a clear description of its core task. What will your agent be focusing on?";
                this.conversationHistory.push({ role: 'user', content: userMessage });
                this.conversationHistory.push({ role: 'assistant', content: rejection });

                return {
                    message: rejection,
                    extractedData: {},
                    isComplete: false,
                    phase: 'discovery'
                };
            }

            this.conversationHistory.push({
                role: 'user',
                content: userMessage,
            });
        }

        // Call Claude with full context
        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1500,
            system: this.getSystemPrompt(),
            messages: this.conversationHistory,
        });

        const assistantMessage = response.content[0].type === 'text'
            ? response.content[0].text
            : '';

        // Add assistant response to history
        this.conversationHistory.push({
            role: 'assistant',
            content: assistantMessage,
        });

        // Extract structured data from the conversation
        const extracted = await this.extractConfig();
        this.extractedConfig = { ...this.extractedConfig, ...extracted };

        // Determine completion status
        const isComplete = this.checkCompleteness(this.extractedConfig);
        const phase = this.determinePhase(this.extractedConfig);

        return {
            message: assistantMessage,
            extractedData: extracted,
            isComplete,
            phase,
        };
    }

    /**
     * Generate system prompt with Wibl knowledge and current state
     */
    private getSystemPrompt(): string {
        const conversationStage = this.conversationHistory.length === 0
            ? 'This is the start of the conversation. Greet the user warmly and begin understanding what they want to build.'
            : `You've had ${Math.floor(this.conversationHistory.length / 2)} exchanges so far.`;

        const configStatus = Object.keys(this.extractedConfig).length > 0
            ? `\n\nCurrent extracted configuration:\n${JSON.stringify(this.extractedConfig, null, 2)}\n\nBuild on this information. Don't re-ask for data you already have unless clarification is needed.`
            : '\n\nNo configuration extracted yet. Start the discovery process.';

        return `${WIBL_KNOWLEDGE}

## Current Conversation State

${conversationStage}${configStatus}

## Instructions for This Turn

1. **If starting**: Welcome the user and ask an open, friendly question to understand their needs
2. **If mid-conversation**: Ask the next most helpful question based on what you know
3. **If near complete**: Summarize understanding and ask for confirmation
4. **If complete**: Congratulate them and preview their agent

Be natural, conversational, and intelligent. Don't follow a rigid script - adapt to the user's needs and communication style.

When you have enough information to extract structured data, ensure it's captured (the system will parse it automatically).`;
    }

    /**
     * Extract structured configuration from conversation using Claude
     */
    private async extractConfig(): Promise<Partial<AgentConfig>> {
        const extractionPrompt = `Based on this conversation history, extract any NEW information into structured fields.

Conversation:
${this.conversationHistory.map((m, i) => `${i % 2 === 0 ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n')}

Current config:
${JSON.stringify(this.extractedConfig, null, 2)}

Respond ONLY with a JSON object containing ONLY fields you can confidently extract from the conversation. Do not include fields you're uncertain about or haven't been discussed. Return empty object {} if no new data.

Format:
{
  "name": "...",
  "purpose": "...",
  "description": "...",
  "personality": "friendly|professional|casual|custom",
  "personalityDetail": "...",
  "channels": ["whatsapp", "web"],
  "responseStyle": "conversational|concise|technical",
  "safetySettings": ["redaction", "validation", "sandbox"],
  "integrations": { "calendar": "...", "crm": "...", "payment": "..." }
}`;

        try {
            const response = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 500,
                messages: [
                    {
                        role: 'user',
                        content: extractionPrompt,
                    },
                ],
            });

            const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
            const jsonMatch = text.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return {};
        } catch (error) {
            console.error('Config extraction error:', error);
            return {};
        }
    }

    /**
     * Check if we have enough information to create the agent
     */
    private checkCompleteness(config: AgentConfig): boolean {
        const required = ['name', 'purpose', 'channels'];
        return required.every(field => config[field as keyof AgentConfig]);
    }

    /**
     * Determine current phase based on extracted data
     */
    private determinePhase(config: AgentConfig): string {
        if (!config.purpose) return 'discovery';
        if (!config.channels || config.channels.length === 0) return 'configuration';
        if (this.checkCompleteness(config)) return 'validation';
        return 'configuration';
    }

    /**
     * Get current conversation state
     */
    getState(): WizardState {
        return {
            conversationHistory: this.conversationHistory.map(m => ({
                role: m.role,
                content: m.content as string,
                timestamp: new Date(),
            })),
            extractedConfig: this.extractedConfig,
            isComplete: this.checkCompleteness(this.extractedConfig),
            currentPhase: this.determinePhase(this.extractedConfig) as any,
        };
    }

    /**
     * Detects if a message is likely gibberish or keyboard mashing
     */
    private isGibberish(text: string): boolean {
        const clean = text.trim().toLowerCase();
        if (clean.length < 3) return false;

        // 1. Check for long sequences of the same character (e.g. "aaaaa")
        if (/(.)\1{4,}/.test(clean)) return true;

        // 2. Check for common keyboard mashing patterns (e.g. "asdfgh")
        const mashPatterns = ['asdf', 'qwer', 'zxcv', 'jkl;', 'bnm,', 'knkk'];
        if (mashPatterns.some(p => clean.includes(p))) return true;

        // 3. Simple entropy check: Too many consonants in a row
        if (/[bcdfghjklmnpqrstvwxyz]{6,}/.test(clean)) return true;

        // 4. Random noise check (no vowels in a longish string)
        if (clean.length > 6 && !/[aeiouy]/.test(clean)) return true;

        return false;
    }

    /**
     * Get final agent configuration
     */
    getFinalConfig(): AgentConfig {
        return this.extractedConfig;
    }
}
