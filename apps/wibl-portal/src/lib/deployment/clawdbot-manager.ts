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

            // 3. Status is success once config is written
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

    async startInstance(agentId: string): Promise<boolean> {
        const agentDir = join(this.DEPLOYMENTS_ROOT, agentId);
        const configPath = join(agentDir, 'clawdbot.json');
        const pidPath = join(agentDir, 'gateway.pid');

        if (!existsSync(configPath)) {
            throw new Error(`Config not found for agent ${agentId}`);
        }

        // Check if already running
        if (await this.isInstanceRunning(agentId)) {
            return true;
        }

        const { spawn } = await import('node:child_process');

        // Use the absolute path to the clawdbot script
        const scriptPath = join(process.cwd(), 'scripts', 'run-node.mjs');

        const child = spawn(process.execPath, [scriptPath, 'gateway'], {
            cwd: process.cwd(),
            env: {
                ...process.env,
                CLAWDBOT_CONFIG_PATH: configPath,
                CLAWDBOT_HIDE_BANNER: '1'
            },
            detached: true,
            stdio: 'ignore'
        });

        if (child.pid) {
            await fs.writeFile(pidPath, child.pid.toString());
            child.unref();
            return true;
        }

        return false;
    }

    async stopInstance(agentId: string): Promise<boolean> {
        const agentDir = join(this.DEPLOYMENTS_ROOT, agentId);
        const pidPath = join(agentDir, 'gateway.pid');

        if (!existsSync(pidPath)) return true;

        const pid = parseInt(await fs.readFile(pidPath, 'utf-8'));
        try {
            process.kill(pid, 'SIGINT');
            await fs.unlink(pidPath);
            return true;
        } catch (error) {
            // If already dead, just clean up
            await fs.unlink(pidPath).catch(() => { });
            return true;
        }
    }

    async isInstanceRunning(agentId: string): Promise<boolean> {
        const agentDir = join(this.DEPLOYMENTS_ROOT, agentId);
        const pidPath = join(agentDir, 'gateway.pid');

        if (!existsSync(pidPath)) return false;

        try {
            const pid = parseInt(await fs.readFile(pidPath, 'utf-8'));
            process.kill(pid, 0); // Check if process exists
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Automated Recovery: Checks if the instance is supposed to be running but isn't.
     * Restarts if necessary and logs the event.
     */
    async checkAndRecover(agentId: string): Promise<{ recovered: boolean, error?: string }> {
        const isRunning = await this.isInstanceRunning(agentId);
        if (isRunning) return { recovered: false };

        console.log(`[Daemon] Instance ${agentId} is down. Attempting recovery...`);
        try {
            const success = await this.startInstance(agentId);
            return { recovered: success };
        } catch (error) {
            return {
                recovered: false,
                error: error instanceof Error ? error.message : 'Recovery failed'
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
