import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const agentId = searchParams.get('agentId');
        const days = parseInt(searchParams.get('days') || '7');

        // Fetch daily metrics
        let query = supabase
            .from('daily_metrics')
            .select('*')
            .order('metric_date', { ascending: true })
            .limit(days);

        if (agentId) {
            query = query.eq('agent_id', agentId);
        }

        const { data: metrics, error } = await query;

        if (error) throw error;

        // Fetch summary totals
        let summaryQuery = supabase
            .from('usage_metrics')
            .select('tokens_input, tokens_output, cost_estimate, sentiment_score, intent_resolved');

        if (agentId) {
            summaryQuery = summaryQuery.eq('agent_id', agentId);
        }

        const { data: rawMetrics, error: summaryError } = await summaryQuery;

        if (summaryError) throw summaryError;

        const summary = rawMetrics.reduce((acc: any, curr: any) => {
            acc.totalTokens += (curr.tokens_input + curr.tokens_output);
            acc.totalCost += Number(curr.cost_estimate);
            acc.totalSuccess += curr.intent_resolved ? 1 : 0;
            if (curr.sentiment_score !== null) {
                acc.sentiments.push(Number(curr.sentiment_score));
            }
            return acc;
        }, { totalTokens: 0, totalCost: 0, totalSuccess: 0, sentiments: [] });

        const avgSentiment = summary.sentiments.length > 0
            ? summary.sentiments.reduce((a: number, b: number) => a + b, 0) / summary.sentiments.length
            : 0;

        return NextResponse.json({
            timeSeries: metrics,
            summary: {
                totalTokens: summary.totalTokens,
                totalCost: summary.totalCost.toFixed(4),
                successRate: rawMetrics.length > 0 ? (summary.totalSuccess / rawMetrics.length) * 100 : 0,
                avgSentiment: avgSentiment.toFixed(2)
            }
        });
    } catch (error) {
        console.error('Analytics fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
