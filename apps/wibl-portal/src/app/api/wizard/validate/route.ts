import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * POST /api/wizard/validate
 * AI-powered validation endpoint using Claude for intelligent input analysis
 */
export async function POST(req: NextRequest) {
    try {
        const { stepId, input } = await req.json();

        if (!stepId || typeof input !== 'string') {
            return NextResponse.json({
                isValid: false,
                feedback: 'Invalid request'
            }, { status: 400 });
        }

        // Use Claude to intelligently validate the input
        const prompt = getValidationPrompt(stepId, input);

        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 300,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        // Parse Claude's response
        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
        const validation = parseAIResponse(responseText);

        return NextResponse.json(validation);
    } catch (error) {
        console.error('AI validation error:', error);
        // Fail open - don't block user if AI fails
        return NextResponse.json({
            isValid: true,
        });
    }
}

function getValidationPrompt(stepId: string, input: string): string {
    const stepContext: Record<string, string> = {
        purpose: 'the core mission or task their AI agent should handle',
        name: 'a name for their AI agent',
        'personality-custom': 'a personality description for their AI agent',
        'knowledge-url': 'a URL to documentation or knowledge base',
    };

    const context = stepContext[stepId] || 'input for their AI agent setup';

    return `You are helping validate user input for an AI agent creation wizard. The user is entering ${context}.

Their input: "${input}"

Analyze this input and respond ONLY in this exact JSON format:
{
    "isValid": true/false,
    "feedback": "brief message if invalid",
    "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"] (only if invalid)
}

Validation rules:
1. Reject obvious gibberish (random characters, keyboard mashing, nonsense like "dlvmlfbalkv...")
2. Reject extremely vague inputs like "help customers" or "do stuff"
3. Reject test inputs like "test", "asdf", "hello"
4. For purpose: require specific, actionable task description (15+ chars)
5. For URLs: must be valid URL format
6. Accept legitimate business tasks, even if brief

If invalid, provide 3 concrete examples the user could use instead.`;
}

function parseAIResponse(response: string): {
    isValid: boolean;
    feedback?: string;
    suggestions?: string[];
} {
    try {
        // Extract JSON from response (Claude sometimes adds markdown)
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in response');
        }

        const parsed = JSON.parse(jsonMatch[0]);
        return {
            isValid: parsed.isValid === true,
            feedback: parsed.feedback,
            suggestions: parsed.suggestions,
        };
    } catch (error) {
        console.error('Failed to parse AI response:', error);
        // Fail open
        return { isValid: true };
    }
}
