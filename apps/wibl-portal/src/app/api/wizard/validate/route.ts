import { NextRequest, NextResponse } from 'next/server';
import { validateWizardInput } from '@/lib/wizard-validation';

/**
 * POST /api/wizard/validate
 * AI-powered validation endpoint for wizard inputs
 */
export async function POST(req: NextRequest) {
    try {
        const { stepId, input, context } = await req.json();

        if (!stepId || typeof input !== 'string') {
            return NextResponse.json({
                isValid: false,
                feedback: 'Invalid request'
            }, { status: 400 });
        }

        const validation = await validateWizardInput(stepId, input, context);

        return NextResponse.json(validation);
    } catch (error) {
        console.error('Validation API error:', error);
        return NextResponse.json({
            isValid: true, // Fail open - don't block users if AI is down
            feedback: undefined
        }, { status: 200 });
    }
}
