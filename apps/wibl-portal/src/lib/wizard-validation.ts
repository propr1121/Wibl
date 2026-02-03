// Smart Validation System for Agent Wizard
// Pattern-based validation with gibberish detection

import React from 'react';

/**
 * Validates wizard input to ensure it's meaningful and actionable
 */
export async function validateWizardInput(
    stepId: string,
    userInput: string,
    context?: any
): Promise<{
    isValid: boolean;
    feedback?: string;
    suggestions?: string[];
    extractedInfo?: any;
}> {
    return basicValidation(stepId, userInput);
}

/**
 * Smart pattern-based validation (no AI required)
 */
function basicValidation(
    stepId: string,
    input: string
): {
    isValid: boolean;
    feedback?: string;
    suggestions?: string[];
} {
    const trimmed = input.trim();

    // Common test/gibberish patterns
    const gibberishPatterns = [
        /^(test|asdf|qwerty|1234|aaa|xxx|hello|hi)$/i,
        /^[a-z]{1,3}$/i, // Single word, 3 chars or less
        /^(.)\1{4,}$/,  // Repeated character (aaaa, 1111)
        /^[^a-zA-Z]*$/,  // No letters at all
    ];

    const isGibberish = gibberishPatterns.some(pattern => pattern.test(trimmed));

    if (isGibberish) {
        return {
            isValid: false,
            feedback: "Hmm, that doesn't look like a real task description. Can you describe what you want your agent to do?",
            suggestions: [
                "Handle customer support inquiries and resolve common issues",
                "Schedule appointments and manage calendar bookings",
                "Manage refund requests and order cancellations"
            ]
        };
    }

    // Length checks
    const minLengths: Record<string, number> = {
        purpose: 15,
        'personality-custom': 10,
        'knowledge-url': 10,
    };

    const minLength = minLengths[stepId] || 5;

    if (trimmed.length < minLength) {
        return {
            isValid: false,
            feedback: `Please provide a bit more detail (at least ${minLength} characters).`,
        };
    }

    // URL validation for knowledge-url step
    if (stepId === 'knowledge-url') {
        try {
            new URL(trimmed);
        } catch {
            return {
                isValid: false,
                feedback: "That doesn't look like a valid URL. Please enter a complete URL starting with http:// or https://",
                suggestions: ["Example: https://docs.yourcompany.com"]
            };
        }
    }

    // Check for vague inputs
    const vaguePatterns = [
        /^help customers?$/i,
        /^do stuff$/i,
        /^work$/i,
        /^handle things?$/i,
    ];

    const isVague = vaguePatterns.some(pattern => pattern.test(trimmed));

    if (isVague && stepId === 'purpose') {
        return {
            isValid: false,
            feedback: "That's a bit too general. Can you be more specific about what tasks the agent should handle?",
            suggestions: [
                "Answer product questions and help customers find what they need",
                "Process returns and exchanges according to company policy",
                "Book demo calls and qualify sales leads"
            ]
        };
    }

    return { isValid: true };
}

/**
 * Client-side validation hook for real-time feedback
 */
export function useInputValidation(stepId: string) {
    const [validationState, setValidationState] = React.useState<{
        isValid: boolean;
        feedback?: string;
        suggestions?: string[];
    }>({ isValid: true });

    const [isValidating, setIsValidating] = React.useState(false);

    const validate = React.useCallback(async (input: string) => {
        if (!input.trim()) {
            setValidationState({ isValid: false });
            return;
        }

        // Immediate client-side validation
        const basicResult = basicValidation(stepId, input);
        setValidationState(basicResult);

        if (!basicResult.isValid) {
            return basicResult;
        }

        // For important steps, call validation endpoint
        if (['purpose', 'personality-custom', 'knowledge-url'].includes(stepId)) {
            setIsValidating(true);
            try {
                const response = await fetch('/api/wizard/validate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ stepId, input })
                });

                const result = await response.json();
                setValidationState(result);
                return result;
            } catch (error) {
                console.error('Validation failed:', error);
                // Fall back to basic validation
                return basicResult;
            } finally {
                setIsValidating(false);
            }
        }

        return basicResult;
    }, [stepId]);

    return { validationState, isValidating, validate };
}
