import { z } from 'zod';
import type { SonarQubeClient } from '../sonarqube-client.js';
export declare const getSourceWithIssuesSchema: {
    componentKey: z.ZodString;
    from: z.ZodOptional<z.ZodNumber>;
    to: z.ZodOptional<z.ZodNumber>;
    branch: z.ZodOptional<z.ZodString>;
};
export declare const getSourceWithIssuesTool: {
    name: string;
    description: string;
    schema: {
        componentKey: z.ZodString;
        from: z.ZodOptional<z.ZodNumber>;
        to: z.ZodOptional<z.ZodNumber>;
        branch: z.ZodOptional<z.ZodString>;
    };
};
export declare function handleGetSourceWithIssues(client: SonarQubeClient, params: {
    componentKey: string;
    from?: number;
    to?: number;
    branch?: string;
}): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
//# sourceMappingURL=sources.d.ts.map