import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // Simulated live activities for the "Secret Sauce" polish
    const activities = [
        {
            id: '1',
            type: 'message',
            status: 'success',
            title: 'WhatsApp Inquiry Resolved',
            description: 'Lead AI addressed a viewing request for property #4282. Response time: 2.4s.',
            timestamp: 'Just now',
            agent: { name: 'Lead Gen AI' }
        },
        {
            id: '2',
            type: 'action',
            status: 'success',
            title: 'HubSpot Sync Complete',
            description: 'Workflow Agent updated lead status for "Marcus Thorne" to "Interested".',
            timestamp: '3m ago',
            agent: { name: 'Workforce Pro' }
        },
        {
            id: '3',
            type: 'knowledge',
            status: 'info',
            title: 'New Source Indexed',
            description: 'System parsed "2026_Q1_Rental_Strategy.pdf". 42 new vectors created.',
            timestamp: '12m ago'
        },
        {
            id: '4',
            type: 'safety',
            status: 'warning',
            title: 'Action Requires Approval',
            description: 'Support Agent requested permission to "Refund Invoice #992". RISK: Medium.',
            timestamp: '15m ago',
            agent: { name: 'Support Bot' }
        },
        {
            id: '5',
            type: 'system',
            status: 'success',
            title: 'Daemon Auto-Recovery',
            description: 'Regional Instance #19 restarted successfully after transient upstream lag.',
            timestamp: '42m ago'
        }
    ];

    return NextResponse.json(activities);
}
