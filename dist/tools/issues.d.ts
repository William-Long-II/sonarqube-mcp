import { z } from 'zod';
import type { SonarQubeClient } from '../sonarqube-client.js';
export declare const getIssuesSchema: {
    projectKey: z.ZodString;
    severities: z.ZodOptional<z.ZodArray<z.ZodEnum<["BLOCKER", "CRITICAL", "MAJOR", "MINOR", "INFO"]>, "many">>;
    types: z.ZodOptional<z.ZodArray<z.ZodEnum<["BUG", "VULNERABILITY", "CODE_SMELL"]>, "many">>;
    files: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    branch: z.ZodOptional<z.ZodString>;
    newCodeOnly: z.ZodOptional<z.ZodBoolean>;
    page: z.ZodOptional<z.ZodNumber>;
    pageSize: z.ZodOptional<z.ZodNumber>;
};
export declare const getIssuesTool: {
    name: string;
    description: string;
    schema: {
        projectKey: z.ZodString;
        severities: z.ZodOptional<z.ZodArray<z.ZodEnum<["BLOCKER", "CRITICAL", "MAJOR", "MINOR", "INFO"]>, "many">>;
        types: z.ZodOptional<z.ZodArray<z.ZodEnum<["BUG", "VULNERABILITY", "CODE_SMELL"]>, "many">>;
        files: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        branch: z.ZodOptional<z.ZodString>;
        newCodeOnly: z.ZodOptional<z.ZodBoolean>;
        page: z.ZodOptional<z.ZodNumber>;
        pageSize: z.ZodOptional<z.ZodNumber>;
    };
};
export declare function handleGetIssues(client: SonarQubeClient, params: {
    projectKey: string;
    severities?: ('BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO')[];
    types?: ('BUG' | 'VULNERABILITY' | 'CODE_SMELL')[];
    files?: string[];
    branch?: string;
    newCodeOnly?: boolean;
    page?: number;
    pageSize?: number;
}): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
//# sourceMappingURL=issues.d.ts.map