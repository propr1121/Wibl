import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { agentId, action } = await req.json();

        // Fetch agent to get deployment info
        const { data: agent, error: agentError } = await supabase
            .from('agents')
            .select('*')
            .eq('id', agentId)
            .single();

        if (agentError || !agent) {
            return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
        }

        if (action === 'start') {
            return NextResponse.json({
                qrDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
                message: 'Scan the QR code in WhatsApp'
            });
        } else if (action === 'wait') {
            // Simulate waiting for scan
            await new Promise(resolve => setTimeout(resolve, 2000));
            return NextResponse.json({
                connected: true,
                message: '✅ WhatsApp connected successfully!'
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Pairing error:', error);
        return NextResponse.json({ error: 'Failed to manage pairing' }, { status: 500 });
    }
}
