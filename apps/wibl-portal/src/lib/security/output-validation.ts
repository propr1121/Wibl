export interface SecurityConfig {
    piiRedaction: boolean;
    maxResponseLength: number;
}

export interface ValidationResult {
    valid: boolean;
    issues: string[];
    sanitized: string;
}

function containsSystemPromptFragments(output: string, systemPrompt: string): boolean {
    if (!systemPrompt || systemPrompt.length < 20) return false;

    // Check for large chunks of the system prompt in the output
    // A simple approach: grab a few unique-ish phrases from the system prompt
    const phrases = systemPrompt
        .split(/[.!?\n]/)
        .map(p => p.trim())
        .filter(p => p.length > 30);

    for (const phrase of phrases) {
        if (output.includes(phrase)) return true;
    }

    return false;
}

function detectPII(input: string): string[] {
    const findings: string[] = [];

    // Very basic PII patterns (Regex based, can be noisy)
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;

    if (emailRegex.test(input)) findings.push('email');
    if (phoneRegex.test(input)) findings.push('phone_number');

    return findings;
}

function sanitizeOutput(output: string, issues: string[], config: SecurityConfig): string {
    let sanitized = output;

    if (issues.includes('potential_system_prompt_leak')) {
        return "I apologize, but I cannot fulfill this request as it would require disclosing my internal instructions.";
    }

    if (config.piiRedaction && issues.includes('pii_detected')) {
        sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]');
        // Add more redaction logic as needed
    }

    return sanitized;
}

export function validateOutput(
    output: string,
    systemPrompt: string,
    config: SecurityConfig
): ValidationResult {
    const issues: string[] = [];

    // Check for system prompt leakage
    if (containsSystemPromptFragments(output, systemPrompt)) {
        issues.push('potential_system_prompt_leak');
    }

    // PII detection
    if (config.piiRedaction) {
        const pii = detectPII(output);
        if (pii.length > 0) {
            issues.push('pii_detected');
        }
    }

    // Length validation
    if (output.length > config.maxResponseLength) {
        issues.push('response_too_long');
    }

    return {
        valid: issues.length === 0,
        issues,
        sanitized: sanitizeOutput(output, issues, config),
    };
}
