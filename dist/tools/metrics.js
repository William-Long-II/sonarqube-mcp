// src/tools/metrics.ts
import { z } from 'zod';
export const getMetricsSchema = {
    projectKey: z.string().describe('Project key (required)'),
    metricKeys: z.array(z.string()).describe('Metric keys to retrieve (e.g., coverage, bugs, vulnerabilities, code_smells, duplicated_lines_density)'),
    branch: z.string().optional().describe('Branch name'),
};
export const getMetricsTool = {
    name: 'get_metrics',
    description: 'Get metric values for a project. Common metrics: coverage, bugs, vulnerabilities, code_smells, duplicated_lines_density, ncloc (lines of code), sqale_index (technical debt).',
    schema: getMetricsSchema,
};
export async function handleGetMetrics(client, params) {
    const response = await client.getComponentMeasures({
        component: params.projectKey,
        metricKeys: params.metricKeys,
        branch: params.branch,
    });
    const measures = response.component.measures.reduce((acc, m) => {
        acc[m.metric] = m.value ?? m.period?.value;
        return acc;
    }, {});
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    project: response.component.key,
                    projectName: response.component.name,
                    metrics: measures,
                }, null, 2),
            },
        ],
    };
}
//# sourceMappingURL=metrics.js.map