import type { SonarQubeConfig, ComponentsSearchResponse, IssuesSearchResponse, HotspotsSearchResponse, RuleShowResponse, QualityGateProjectStatusResponse, QualityGateShowResponse, MeasuresComponentResponse, SourcesShowResponse } from './types.js';
export declare class SonarQubeClient {
    readonly baseUrl: string;
    private readonly authHeader;
    constructor(config: SonarQubeConfig);
    private request;
    searchComponents(params?: {
        qualifiers?: string;
        q?: string;
        p?: number;
        ps?: number;
    }): Promise<ComponentsSearchResponse>;
    searchIssues(params: {
        componentKeys?: string[];
        severities?: string[];
        types?: string[];
        files?: string[];
        branch?: string;
        sinceLeakPeriod?: boolean;
        p?: number;
        ps?: number;
    }): Promise<IssuesSearchResponse>;
    searchHotspots(params: {
        projectKey: string;
        status?: string;
        branch?: string;
        p?: number;
        ps?: number;
    }): Promise<HotspotsSearchResponse>;
    showRule(ruleKey: string): Promise<RuleShowResponse>;
    getProjectQualityGateStatus(params: {
        projectKey: string;
        branch?: string;
    }): Promise<QualityGateProjectStatusResponse>;
    showQualityGate(params: {
        name?: string;
        id?: string;
    }): Promise<QualityGateShowResponse>;
    getComponentMeasures(params: {
        component: string;
        metricKeys: string[];
        branch?: string;
    }): Promise<MeasuresComponentResponse>;
    showSource(params: {
        key: string;
        from?: number;
        to?: number;
        branch?: string;
    }): Promise<SourcesShowResponse>;
}
//# sourceMappingURL=sonarqube-client.d.ts.map