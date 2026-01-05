import { z } from 'zod';
import type { SonarQubeClient } from '../sonarqube-client.js';
export declare const listProjectsSchema: {
    query: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodNumber>;
    pageSize: z.ZodOptional<z.ZodNumber>;
};
export declare const listProjectsTool: {
    name: string;
    description: string;
    schema: {
        query: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodNumber>;
        pageSize: z.ZodOptional<z.ZodNumber>;
    };
};
export declare function handleListProjects(client: SonarQubeClient, params: {
    query?: string;
    page?: number;
    pageSize?: number;
}): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
//# sourceMappingURL=projects.d.ts.map