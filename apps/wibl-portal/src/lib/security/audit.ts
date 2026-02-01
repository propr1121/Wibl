import { createClient } from '@/lib/supabase/server';
import { RiskLevel } from './injection-detection';

export async function logSecurityEvent({
    agentId,
    userId,
    eventType,
    severity,
    details,
    inputSnippet,
    blocked = false
}: {
    agentId?: string;
    userId: string;
    eventType: string;
    severity: RiskLevel;
    details: any;
    inputSnippet?: string;
    blocked?: boolean;
}) {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from('security_events')
            .insert({
                agent_id: agentId,
                user_id: userId,
                event_type: eventType,
                severity,
                details,
                input_snippet: inputSnippet?.substring(0, 500),
                blocked
            });

        if (error) {
            console.error('Failed to log security event:', error);
        }
    } catch (err) {
        console.error('Error in logSecurityEvent:', err);
    }
}
