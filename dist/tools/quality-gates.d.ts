import { z } from 'zod';
import type { SonarQubeClient } from '../sonarqube-client.js';
export declare const getQualityGateStatusSchema: {
    projectKey: z.ZodString;
    branch: z.ZodOptional<z.ZodString>;
};
export declare const getQualityGateStatusTool: {
    name: string;
    description: string;
    schema: {
        projectKey: z.ZodString;
        branch: z.ZodOptional<z.ZodString>;
    };
};
export declare function handleGetQualityGateStatus(client: SonarQubeClient, params: {
    projectKey: string;
    branch?: string;
}): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
export declare const getQualityGateSchema: {
    name: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
};
export declare const getQualityGateTool: {
    name: string;
    description: string;
    schema: {
        name: z.ZodOptional<z.ZodString>;
        id: z.ZodOptional<z.ZodString>;
    };
};
export declare function handleGetQualityGate(client: SonarQubeClient, params: {
    name?: string;
    id?: string;
}): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
//# sourceMappingURL=quality-gates.d.ts.map