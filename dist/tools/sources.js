// src/tools/sources.ts
import { z } from 'zod';
export const getSourceWithIssuesSchema = {
    componentKey: z.string().describe('File component key (e.g., project:src/main/java/File.java)'),
    from: z.number().optional().describe('Start line number'),
    to: z.number().optional().describe('End line number'),
    branch: z.string().optional().describe('Branch name'),
};
export const getSourceWithIssuesTool = {
    name: 'get_source_with_issues',
    description: 'Get source code for a file. Use in combination with get_issues to see the actual code at issue locations.',
    schema: getSourceWithIssuesSchema,
};
export async function handleGetSourceWithIssues(client, params) {
    const response = await client.showSource({
        key: params.componentKey,
        from: params.from,
        to: params.to,
        branch: params.branch,
    });
    const lines = response.sources.map(s => ({
        line: s.line,
        code: s.code,
    }));
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    component: params.componentKey,
                    fromLine: params.from,
                    toLine: params.to,
                    lines,
                }, null, 2),
            },
        ],
    };
}
//# sourceMappingURL=sources.js.map