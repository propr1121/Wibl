/**
 * Simple text chunking utility.
 * In production, this could be more sophisticated (e.g., using Tiktoken for token-exact splitting).
 */
export function chunkText(text: string, maxChunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + maxChunkSize, text.length);
        let chunk = text.substring(start, end);

        // Try to find a good breaking point (period, newline, or space)
        if (end < text.length) {
            const lastPeriod = chunk.lastIndexOf('.');
            const lastNewline = chunk.lastIndexOf('\n');
            const lastSpace = chunk.lastIndexOf(' ');

            const breakPoint = Math.max(lastPeriod, lastNewline, lastSpace);

            if (breakPoint > maxChunkSize * 0.8) {
                chunk = text.substring(start, start + breakPoint + 1);
            }
        }

        chunks.push(chunk.trim());
        start += chunk.length - overlap;

        // Safety check to prevent infinite loop
        if (chunk.length <= overlap) {
            start = end;
        }
    }

    return chunks.filter(c => c.length > 10);
}
