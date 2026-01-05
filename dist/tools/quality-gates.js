import { z } from 'zod';
// get_quality_gate_status
export const getQualityGateStatusSchema = {
    projectKey: z.string().describe('Project key (required)'),
    branch: z.string().optional().describe('Branch name'),
};
export const getQualityGateStatusTool = {
    name: 'get_quality_gate_status',
    description: 'Get the quality gate status for a project. Shows pass/fail status and which conditions failed. Use this to understand why a build failed quality checks.',
    schema: getQualityGateStatusSchema,
};
export async function handleGetQualityGateStatus(client, params) {
    const response = await client.getProjectQualityGateStatus({
        projectKey: params.projectKey,
        branch: params.branch,
    });
    const status = response.projectStatus;
    const failedConditions = status.conditions.filter(c => c.status === 'ERROR');
    const warningConditions = status.conditions.filter(c => c.status === 'WARN');
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    status: status.status,
                    passed: status.status === 'OK',
                    failedConditions: failedConditions.map(c => ({
                        metric: c.metricKey,
                        comparator: c.comparator,
                        threshold: c.errorThreshold,
                        actual: c.actualValue,
                    })),
                    warningConditions: warningConditions.map(c => ({
                        metric: c.metricKey,
                        comparator: c.comparator,
                        threshold: c.errorThreshold,
                        actual: c.actualValue,
                    })),
                    allConditions: status.conditions.map(c => ({
                        metric: c.metricKey,
                        status: c.status,
                        comparator: c.comparator,
                        threshold: c.errorThreshold,
                        actual: c.actualValue,
                    })),
                }, null, 2),
            },
        ],
    };
}
// get_quality_gate
export const getQualityGateSchema = {
    name: z.string().optional().describe('Quality gate name'),
    id: z.string().optional().describe('Quality gate ID'),
};
export const getQualityGateTool = {
    name: 'get_quality_gate',
    description: 'Get the definition of a quality gate, including all conditions and thresholds. Use this to understand what requirements a project must meet.',
    schema: getQualityGateSchema,
};
export async function handleGetQualityGate(client, params) {
    if (!params.name && !params.id) {
        throw new Error('Either name or id is required');
    }
    const response = await client.showQualityGate({
        name: params.name,
        id: params.id,
    });
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    id: response.id,
                    name: response.name,
                    isDefault: response.isDefault,
                    isBuiltIn: response.isBuiltIn,
                    conditions: response.conditions?.map(c => ({
                        id: c.id,
                        metric: c.metric,
                        operator: c.op,
                        errorThreshold: c.error,
                    })),
                }, null, 2),
            },
        ],
    };
}
//# sourceMappingURL=quality-gates.js.map