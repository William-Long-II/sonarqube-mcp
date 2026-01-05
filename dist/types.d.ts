export interface SonarQubeConfig {
    baseUrl: string;
    token: string;
}
export interface PagingInfo {
    pageIndex: number;
    pageSize: number;
    total: number;
}
export interface Component {
    key: string;
    name: string;
    qualifier: string;
    project?: string;
    lastAnalysisDate?: string;
}
export interface ComponentsSearchResponse {
    paging: PagingInfo;
    components: Component[];
}
export interface Issue {
    key: string;
    rule: string;
    severity: string;
    component: string;
    project: string;
    line?: number;
    message: string;
    type: string;
    status: string;
    creationDate: string;
    updateDate: string;
    tags?: string[];
    flows?: IssueFlow[];
}
export interface IssueFlow {
    locations: IssueLocation[];
}
export interface IssueLocation {
    component: string;
    msg?: string;
    textRange?: TextRange;
}
export interface TextRange {
    startLine: number;
    endLine: number;
    startOffset: number;
    endOffset: number;
}
export interface IssuesSearchResponse {
    paging: PagingInfo;
    issues: Issue[];
    components: Component[];
}
export interface Hotspot {
    key: string;
    component: string;
    project: string;
    securityCategory: string;
    vulnerabilityProbability: string;
    status: string;
    line?: number;
    message: string;
    creationDate: string;
    updateDate: string;
}
export interface HotspotsSearchResponse {
    paging: PagingInfo;
    hotspots: Hotspot[];
}
export interface Rule {
    key: string;
    name: string;
    severity: string;
    type: string;
    lang?: string;
    langName?: string;
    htmlDesc?: string;
    mdDesc?: string;
    tags?: string[];
}
export interface RuleShowResponse {
    rule: Rule;
}
export interface QualityGateCondition {
    status: string;
    metricKey: string;
    comparator: string;
    errorThreshold?: string;
    actualValue?: string;
}
export interface QualityGateProjectStatus {
    status: string;
    conditions: QualityGateCondition[];
}
export interface QualityGateProjectStatusResponse {
    projectStatus: QualityGateProjectStatus;
}
export interface QualityGateDefinitionCondition {
    id: number;
    metric: string;
    op: string;
    error: string;
}
export interface QualityGate {
    id: string;
    name: string;
    isDefault?: boolean;
    isBuiltIn?: boolean;
    conditions?: QualityGateDefinitionCondition[];
}
export interface QualityGateShowResponse {
    name: string;
    id: string;
    isDefault?: boolean;
    isBuiltIn?: boolean;
    conditions?: QualityGateDefinitionCondition[];
}
export interface Measure {
    metric: string;
    value?: string;
    period?: {
        value: string;
        bestValue?: boolean;
    };
}
export interface MeasuresComponent {
    key: string;
    name: string;
    qualifier: string;
    measures: Measure[];
}
export interface MeasuresComponentResponse {
    component: MeasuresComponent;
}
export interface SourceLine {
    line: number;
    code: string;
    scmAuthor?: string;
    scmDate?: string;
    scmRevision?: string;
}
export interface SourcesShowResponse {
    sources: SourceLine[];
}
export interface SonarQubeError {
    errors: Array<{
        msg: string;
    }>;
}
//# sourceMappingURL=types.d.ts.map