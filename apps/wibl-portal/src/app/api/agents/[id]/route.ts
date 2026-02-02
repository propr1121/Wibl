import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateAgentSchema } from '@/lib/validations/agent';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: agent, error } = await supabase
            .from('agents')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json(agent);
    } catch (error) {
        console.error('Error fetching agent:', error);
        return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const json = await req.json();
        const validatedData = updateAgentSchema.safeParse(json);

        if (!validatedData.success) {
            return NextResponse.json({ error: validatedData.error.issues }, { status: 400 });
        }

        const { data: agent, error } = await supabase
            .from('agents')
            .update(validatedData.data)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json(agent);
    } catch (error) {
        console.error('Error updating agent:', error);
        return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { error } = await supabase
            .from('agents')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            throw error;
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting agent:', error);
        return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
    }
}
