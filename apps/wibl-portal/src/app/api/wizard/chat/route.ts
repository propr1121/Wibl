import { NextRequest, NextResponse } from 'next/server';
import { WiblAIWizard } from '@/lib/wibl-ai-wizard';

// Store active wizard sessions in memory
// In production, use Redis or database
const activeSessions = new Map<string, WiblAIWizard>();

/**
 * POST /api/wizard/chat
 *AI-driven conversational wizard endpoint
 * 
 * Body:
 * {
 *   sessionId: string,
 *   message?: string  // optional for first call
 * }
 */
export async function POST(req: NextRequest) {
    try {
        const { sessionId, message } = await req.json();

        if (!sessionId) {
            return NextResponse.json({
                error: 'Session ID required'
            }, { status: 400 });
        }

        // Get or create wizard session
        let wizard = activeSessions.get(sessionId);
        if (!wizard) {
            wizard = new WiblAIWizard(sessionId);
            activeSessions.set(sessionId, wizard);
        }

        // Continue conversation
        const response = await wizard.chat(message);

        return NextResponse.json({
            message: response.message,
            extractedData: response.extractedData,
            isComplete: response.isComplete,
            phase: response.phase,
            state: wizard.getState(),
        });
    } catch (error) {
        console.error('AI wizard error:', error);
        return NextResponse.json({
            error: 'Failed to process conversation',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

/**
 * GET /api/wizard/chat
 * Get current wizard state
 */
export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get('sessionId');

    if (!sessionId) {
        return NextResponse.json({
            error: 'Session ID required'
        }, { status: 400 });
    }

    const wizard = activeSessions.get(sessionId);
    if (!wizard) {
        return NextResponse.json({
            error: 'Session not found'
        }, { status: 404 });
    }

    return NextResponse.json({
        state: wizard.getState(),
        finalConfig: wizard.getFinalConfig(),
    });
}

/**
 * DELETE /api/wizard/chat
 * End wizard session
 */
export async function DELETE(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get('sessionId');

    if (!sessionId) {
        return NextResponse.json({
            error: 'Session ID required'
        }, { status: 400 });
    }

    activeSessions.delete(sessionId);

    return NextResponse.json({
        success: true
    });
}
