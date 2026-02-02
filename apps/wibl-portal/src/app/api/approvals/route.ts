import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: approvals, error } = await supabase
            .from('action_approvals')
            .select('*, agent:agents(name), tool:tool_registry(name, icon_url)')
            .eq('user_id', user.id)
            .eq('status', 'pending')
            .order('requested_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(approvals);
    } catch (error) {
        console.error('Error fetching approvals:', error);
        return NextResponse.json({ error: 'Failed to fetch approvals' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, status, notes } = await req.json();

        const { data: approval, error } = await supabase
            .from('action_approvals')
            .update({
                status,
                notes,
                processed_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        // In a real app, this would trigger the actual tool execution if approved
        // e.g. send the WhatsApp message or update the CRM.

        return NextResponse.json(approval);
    } catch (error) {
        console.error('Error processing approval:', error);
        return NextResponse.json({ error: 'Failed to process approval' }, { status: 500 });
    }
}
