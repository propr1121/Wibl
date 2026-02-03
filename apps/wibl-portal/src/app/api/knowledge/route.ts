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
    const supabase = await createClient();

    try {
        // 1. Fetch the item
        const { data: item, error: fetchError } = await supabase
            .from('knowledge_items')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !item) {
            console.error('Failed to fetch knowledge item for processing:', fetchError);
            return;
        }

        // Update status to processing (already set by caller, but good for safety)
        await supabase.from('knowledge_items').update({ processing_status: 'processing' }).eq('id', id);

        let content = item.content || '';

        // 2. Fetch from URL if needed
        if (item.type === 'url' && item.source_url) {
            try {
                const response = await fetch(item.source_url);
                if (response.ok) {
                    const html = await response.text();
                    // Simple HTML strip until we add a proper parser like Readability
                    content = html
                        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '')
                        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, '')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                }
            } catch (err) {
                console.error(`Failed to fetch URL ${item.source_url}:`, err);
            }
        }

        if (!content || content.length < 20) {
            throw new Error('No substantial content found to process.');
        }

        // 3. Chunking
        const { chunkText } = await import('@/lib/ai/chunking');
        const chunks = chunkText(content);

        // 4. Embedding & Storage
        const { generateEmbedding } = await import('@/lib/ai/openai');

        let processedChunks = 0;
        let totalTokens = 0;

        for (let i = 0; i < chunks.length; i++) {
            const chunkContent = chunks[i];
            try {
                const embedding = await generateEmbedding(chunkContent);

                await supabase.from('knowledge_chunks').insert({
                    knowledge_item_id: id,
                    chunk_index: i,
                    content: chunkContent,
                    embedding: embedding,
                    token_count: Math.ceil(chunkContent.length / 4), // Rough estimate
                });

                processedChunks++;
                totalTokens += Math.ceil(chunkContent.length / 4);
            } catch (err) {
                console.error(`Failed to process chunk ${i}:`, err);
            }
        }

        // 5. Finalize status
        await supabase
            .from('knowledge_items')
            .update({
                processing_status: 'ready',
                content: content.substring(0, 10000), // Store preview if not already there
                chunk_count: processedChunks,
                total_tokens: totalTokens
            })
            .eq('id', id);

    } catch (error) {
        console.error('RAG Processing error:', error);
        await supabase
            .from('knowledge_items')
            .update({
                processing_status: 'failed',
                processing_error: error instanceof Error ? error.message : 'Unknown error'
            })
            .eq('id', id);
    }
}
