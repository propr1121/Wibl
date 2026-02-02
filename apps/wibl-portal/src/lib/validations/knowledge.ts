import { z } from 'zod';

export const createKnowledgeSchema = z.object({
    type: z.enum(['document', 'url', 'text', 'qa_pair']),
    title: z.string().min(1).max(255),
    content: z.string().optional(),
    file_path: z.string().optional(),
    source_url: z.string().url().optional(),
    agent_id: z.string().uuid().optional().nullable(),
});

export const updateKnowledgeSchema = createKnowledgeSchema.partial();

export type CreateKnowledgeInput = z.infer<typeof createKnowledgeSchema>;
export type UpdateKnowledgeInput = z.infer<typeof updateKnowledgeSchema>;
