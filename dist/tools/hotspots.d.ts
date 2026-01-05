import { z } from 'zod';
import type { SonarQubeClient } from '../sonarqube-client.js';
export declare const getHotspotsSchema: {
    projectKey: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<["TO_REVIEW", "REVIEWED"]>>;
    branch: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodNumber>;
    pageSize: z.ZodOptional<z.ZodNumber>;
};
export declare const getHotspotsTool: {
    name: string;
    description: string;
    schema: {
        projectKey: z.ZodString;
        status: z.ZodOptional<z.ZodEnum<["TO_REVIEW", "REVIEWED"]>>;
        branch: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodNumber>;
        pageSize: z.ZodOptional<z.ZodNumber>;
    };
};
export declare function handleGetHotspots(client: SonarQubeClient, params: {
    projectKey: string;
    status?: 'TO_REVIEW' | 'REVIEWED';
    branch?: string;
    page?: number;
    pageSize?: number;
}): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
//# sourceMappingURL=hotspots.d.ts.map