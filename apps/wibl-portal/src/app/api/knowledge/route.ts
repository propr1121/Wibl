import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createKnowledgeSchema } from '@/lib/validations/knowledge';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const agentId = searchParams.get('agentId');

        let query = supabase
            .from('knowledge_items')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (agentId) {
            query = query.eq('agent_id', agentId);
        }

        const { data: items, error } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching knowledge:', error);
        return NextResponse.json({ error: 'Failed to fetch knowledge' }, { status: 500 });
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
        const validatedData = createKnowledgeSchema.safeParse(json);

        if (!validatedData.success) {
            return NextResponse.json({ error: validatedData.error.issues }, { status: 400 });
        }

        // 1. Insert knowledge item
        const { data: item, error } = await supabase
            .from('knowledge_items')
            .insert({
                ...validatedData.data,
                user_id: user.id,
                processing_status: 'processing'
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        // 2. Simulate Background Processing (In a real app, this would be a webhook or queue)
        // For this demo, we'll "process" it immediately in a detached manner
        processKnowledge(item.id).catch(console.error);

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error('Error creating knowledge:', error);
        return NextResponse.json({ error: 'Failed to create knowledge' }, { status: 500 });
    }
}

async function processKnowledge(id: string) {
    // Artificial delay for premium "processing" feel
    await new Promise(resolve => setTimeout(resolve, 3000));

    // In a real app, this is where we'd:
    // 1. Scrape URL or Parse PDF
    // 2. Create chunks
    // 3. Generate embeddings
    // 4. Upsert to vector table

    const supabase = await createClient();
    await supabase
        .from('knowledge_items')
        .update({
            processing_status: 'ready',
            chunk_count: Math.floor(Math.random() * 50) + 10,
            total_tokens: Math.floor(Math.random() * 5000) + 1000
        })
        .eq('id', id);
}
