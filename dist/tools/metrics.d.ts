import { z } from 'zod';
import type { SonarQubeClient } from '../sonarqube-client.js';
export declare const getMetricsSchema: {
    projectKey: z.ZodString;
    metricKeys: z.ZodArray<z.ZodString, "many">;
    branch: z.ZodOptional<z.ZodString>;
};
export declare const getMetricsTool: {
    name: string;
    description: string;
    schema: {
        projectKey: z.ZodString;
        metricKeys: z.ZodArray<z.ZodString, "many">;
        branch: z.ZodOptional<z.ZodString>;
    };
};
export declare function handleGetMetrics(client: SonarQubeClient, params: {
    projectKey: string;
    metricKeys: string[];
    branch?: string;
}): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
//# sourceMappingURL=metrics.d.ts.map