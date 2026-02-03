-- Add Vector Search function for RAG
CREATE OR REPLACE FUNCTION match_knowledge_chunks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_agent_id uuid
)
returns table (
  id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    kc.id,
    kc.content,
    1 - (kc.embedding <=> query_embedding) as similarity
  from knowledge_chunks kc
  join knowledge_items ki on kc.knowledge_item_id = ki.id
  where ki.agent_id = p_agent_id
    and 1 - (kc.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;
