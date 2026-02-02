import { Agent } from '../types/agent';
import { join } from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import os from 'os';

export interface DeploymentResult {
    instanceId: string;
    gatewayUrl: string;
    status: 'success' | 'failed' | 'provisioning';
    error?: string;
}

/**
 * ClawdbotConfig follows the schema defined in clawdbot's core gateway.
 * This ensures the generated file is valid for the engine.
 */
export interface ClawdbotConfig {
    agents: {
        defaults: {
            model: {
                primary: string;
            };
            workspace?: string;
        };
    };
    models: {
        providers: {
            anthropic?: {
                apiKey: string;
                baseUrl: string;
            };
            openai?: {
                apiKey: string;
            };
        };
    };
    gateway: {
        mode: 'local' | 'remote';
        port: number;
        bind: 'loopback' | 'lan';
        auth: {
            mode: 'token';
            token: string;
        };
    };
    channels: {
        whatsapp?: { enabled: boolean; pairing: 'qr' | 'pairing_code' };
        telegram?: { enabled: boolean; botToken?: string };
        slack?: { enabled: boolean; botToken?: string };
        web?: { enabled: boolean };
    };
}

export class ClawdbotManager {
    private DEPLOYMENTS_ROOT = join(os.homedir(), '.clawdbot', 'deployments');

    async provision(agent: Agent): Promise<DeploymentResult> {
        try {
            const agentDir = join(this.DEPLOYMENTS_ROOT, agent.id);

            // 1. Create agent directory structure
            if (!existsSync(agentDir)) {
                await fs.mkdir(agentDir, { recursive: true });
            }

            // 2. Generate configuration
            const config = this.generateClawdbotConfig(agent);
            await fs.writeFile(
                join(agentDir, 'clawdbot.json'),
                JSON.stringify(config, null, 2)
            );

            // 3. In a real SaaS, we would trigger a Docker container or fly.io machine here.
            // For this local platform demo, we'll return the URL where this agent *would* be.
            // We use a deterministic port strategy for the local multi-agent simulation.
            const port = 19000 + (Math.abs(this.hashCode(agent.id)) % 1000);
            const gatewayUrl = `http://localhost:${port}`;

            return {
                instanceId: agent.id,
                gatewayUrl: gatewayUrl,
                status: 'success'
            };
        } catch (error) {
            console.error('Provisioning failed:', error);
            return {
                instanceId: agent.id,
                gatewayUrl: '',
                status: 'failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    generateClawdbotConfig(agent: Agent): ClawdbotConfig {
        return {
            agents: {
                defaults: {
                    model: {
                        primary: 'anthropic/claude-3-5-sonnet-latest',
                    },
                    workspace: join(this.DEPLOYMENTS_ROOT, agent.id, 'workspace')
                },
            },
            models: {
                providers: {
                    anthropic: {
                        apiKey: process.env.ANTHROPIC_API_KEY || '',
                        baseUrl: 'https://api.anthropic.com'
                    }
                }
            },
            gateway: {
                mode: 'local',
                port: 19000 + (Math.abs(this.hashCode(agent.id)) % 1000),
                bind: 'loopback',
                auth: {
                    mode: 'token',
                    token: Buffer.from(agent.id).toString('base64').substring(0, 16)
                }
            },
            channels: this.mapChannels(agent.deployment.channels)
        };
    }

    private mapChannels(channels: string[]): any {
        const config: any = {};
        if (channels.includes('web')) config.web = { enabled: true };
        if (channels.includes('whatsapp')) config.whatsapp = { enabled: true, pairing: 'qr' };
        if (channels.includes('slack')) config.slack = { enabled: true };
        if (channels.includes('telegram')) config.telegram = { enabled: true };
        return config;
    }

    private hashCode(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
}
