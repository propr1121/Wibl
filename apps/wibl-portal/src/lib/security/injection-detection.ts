const INJECTION_PATTERNS = [
    // Direct overrides
    /ignore (all |any )?(previous|prior|above) (instructions?|prompts?|rules?)/i,
    /disregard (everything|all|what)/i,
    /forget (everything|all|what)/i,

    // Role manipulation
    /you are now/i,
    /act as (a |an )?/i,
    /pretend (to be|you're)/i,
    /your new (role|purpose|instructions)/i,
    /new persona/i,

    // System prompt extraction
    /what (are|is) your (system |initial )?(prompt|instructions)/i,
    /show me your (prompt|rules|instructions)/i,
    /repeat (your |the )?(system |initial )?prompt/i,
    /print your instructions/i,

    // Jailbreaks
    /DAN mode/i,
    /developer mode/i,
    /admin mode/i,
    /sudo/i,
    /jailbreak/i,
    /\[SYSTEM\]/i,

    // Encoding attacks
    /base64/i,
    /\\x[0-9a-f]{2}/i,
    /\\u[0-9a-f]{4}/i,
];

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface DetectionResult {
    detected: boolean;
    patterns: string[];
    riskLevel: RiskLevel;
    sanitized: string;
    blocked: boolean;
}

function calculateRiskLevel(matchedPatterns: string[]): RiskLevel {
    if (matchedPatterns.length === 0) return 'low';
    if (matchedPatterns.length === 1) return 'medium';
    if (matchedPatterns.length === 2) return 'high';
    return 'critical';
}

export function sanitizeInput(input: string): string {
    if (!input) return '';

    let sanitized = input;

    // Normalize unicode to prevent bypasses
    sanitized = sanitized.normalize('NFKC');

    // Strip control characters
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

    // Basic escaping of potentially problematic sequences for LLMs
    // e.g. stopping attempts to use special tokens if visible
    sanitized = sanitized.replace(/\[INST\]|\[\/INST\]|<<SYS>>|<<\/SYS>>/g, '');

    // Truncate if excessively long (e.g. DoS attempts via prompt expansion)
    const MAX_LENGTH = 4000;
    if (sanitized.length > MAX_LENGTH) {
        sanitized = sanitized.substring(0, MAX_LENGTH);
    }

    return sanitized;
}

export function detectInjection(input: string): DetectionResult {
    const matchedPatterns: string[] = [];

    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(input)) {
            matchedPatterns.push(pattern.source);
        }
    }

    const riskLevel = calculateRiskLevel(matchedPatterns);
    const blocked = riskLevel === 'critical' || matchedPatterns.length > 2;

    return {
        detected: matchedPatterns.length > 0,
        patterns: matchedPatterns,
        riskLevel,
        sanitized: blocked ? '' : sanitizeInput(input),
        blocked,
    };
}
