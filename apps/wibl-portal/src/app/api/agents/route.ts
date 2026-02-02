import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAgentSchema } from '@/lib/validations/agent';
import { ClawdbotManager } from '@/lib/deployment/clawdbot-manager';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: agents, error } = await supabase
            .from('agents')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json(agents);
    } catch (error) {
        console.error('Error fetching agents:', error);
        return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const json = await req.json();
        const validatedData = createAgentSchema.safeParse(json);

        if (!validatedData.success) {
            return NextResponse.json({ error: validatedData.error.issues }, { status: 400 });
        }

        // 1. Initial Insert to get an ID
        const { data: agent, error } = await supabase
            .from('agents')
            .insert({
                ...validatedData.data,
                user_id: user.id,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        // 2. Provision Clawdbot Engine
        const manager = new ClawdbotManager();
        const deployment = await manager.provision(agent);

        // 3. Update agent with deployment info
        const { data: updatedAgent, error: updateError } = await supabase
            .from('agents')
            .update({
                deployment: {
                    ...agent.deployment,
                    gatewayUrl: deployment.gatewayUrl,
                    status: deployment.status === 'success' ? 'active' : 'failed',
                    deployedAt: new Date().toISOString()
                }
            })
            .eq('id', agent.id)
            .select()
            .single();

        if (updateError) {
            console.error('Failed to update agent with deployment info:', updateError);
        }

        return NextResponse.json(updatedAgent || agent, { status: 201 });
    } catch (error) {
        console.error('Error creating agent:', error);
        return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
    }
}
