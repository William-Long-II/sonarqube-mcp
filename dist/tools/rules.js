// src/tools/rules.ts
import { z } from 'zod';
export const getRuleSchema = {
    ruleKey: z.string().describe('Rule key (e.g., java:S1234, typescript:S2077)'),
};
export const getRuleTool = {
    name: 'get_rule',
    description: 'Get detailed information about a SonarQube rule, including its description, severity, and how to fix violations.',
    schema: getRuleSchema,
};
export async function handleGetRule(client, params) {
    const response = await client.showRule(params.ruleKey);
    const rule = response.rule;
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    key: rule.key,
                    name: rule.name,
                    severity: rule.severity,
                    type: rule.type,
                    language: rule.langName || rule.lang,
                    tags: rule.tags,
                    description: rule.mdDesc || rule.htmlDesc,
                }, null, 2),
            },
        ],
    };
}
//# sourceMappingURL=rules.js.map