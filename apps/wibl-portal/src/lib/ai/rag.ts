import { createClient } from '@/lib/supabase/server';
import { generateEmbedding } from './openai';

export interface SearchResult {
    id: string;
    content: string;
    similarity: number;
}

/**
 * Searches the vector database for relevant knowledge chunks based on a query.
 */
export async function searchKnowledge(
    query: string,
    agentId: string,
    limit: number = 5,
    threshold: number = 0.5
): Promise<SearchResult[]> {
    const supabase = await createClient();

    // 1. Generate embedding for the query
    const embedding = await generateEmbedding(query);

    // 2. Call the RPC function in Supabase
    const { data, error } = await supabase.rpc('match_knowledge_chunks', {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit,
        p_agent_id: agentId,
    });

    if (error) {
        console.error('Error searching knowledge:', error);
        throw error;
    }

    return data as SearchResult[];
}
