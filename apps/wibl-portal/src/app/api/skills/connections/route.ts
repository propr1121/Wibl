import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: connections, error } = await supabase
            .from('user_tool_connections')
            .select('*, tool:tool_registry(*)')
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json(connections);
    } catch (error) {
        console.error('Error fetching connections:', error);
        return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { toolId } = await req.json();

        const { data: connection, error } = await supabase
            .from('user_tool_connections')
            .upsert({
                user_id: user.id,
                tool_id: toolId,
                connected_at: new Date().toISOString(),
                permissions_granted: ['read', 'write']
            })
            .select('*, tool:tool_registry(*)')
            .single();

        if (error) throw error;

        return NextResponse.json(connection);
    } catch (error) {
        console.error('Error creating connection:', error);
        return NextResponse.json({ error: 'Failed to create connection' }, { status: 500 });
    }
}
