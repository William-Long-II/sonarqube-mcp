import { z } from 'zod';
import type { SonarQubeClient } from '../sonarqube-client.js';
export declare const getRuleSchema: {
    ruleKey: z.ZodString;
};
export declare const getRuleTool: {
    name: string;
    description: string;
    schema: {
        ruleKey: z.ZodString;
    };
};
export declare function handleGetRule(client: SonarQubeClient, params: {
    ruleKey: string;
}): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
//# sourceMappingURL=rules.d.ts.map