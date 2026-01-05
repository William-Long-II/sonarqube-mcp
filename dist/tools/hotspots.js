// src/tools/hotspots.ts
import { z } from 'zod';
export const getHotspotsSchema = {
    projectKey: z.string().describe('Project key (required)'),
    status: z.enum(['TO_REVIEW', 'REVIEWED']).optional().describe('Filter by review status'),
    branch: z.string().optional().describe('Branch name'),
    page: z.number().optional().describe('Page number (default: 1)'),
    pageSize: z.number().optional().describe('Results per page (default: 100, max: 500)'),
};
export const getHotspotsTool = {
    name: 'get_hotspots',
    description: 'Get security hotspots for a SonarQube project. Hotspots are potential security issues that require manual review.',
    schema: getHotspotsSchema,
};
export async function handleGetHotspots(client, params) {
    const response = await client.searchHotspots({
        projectKey: params.projectKey,
        status: params.status,
        branch: params.branch,
        p: params.page,
        ps: params.pageSize,
    });
    const hotspots = response.hotspots.map(h => ({
        key: h.key,
        component: h.component,
        securityCategory: h.securityCategory,
        vulnerabilityProbability: h.vulnerabilityProbability,
        status: h.status,
        line: h.line,
        message: h.message,
        creationDate: h.creationDate,
    }));
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    hotspots,
                    paging: {
                        page: response.paging.pageIndex,
                        pageSize: response.paging.pageSize,
                        total: response.paging.total,
                    },
                }, null, 2),
            },
        ],
    };
}
//# sourceMappingURL=hotspots.js.map