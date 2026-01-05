// src/sonarqube-client.ts
import type {
  SonarQubeConfig,
  ComponentsSearchResponse,
  IssuesSearchResponse,
  HotspotsSearchResponse,
  RuleShowResponse,
  QualityGateProjectStatusResponse,
  QualityGateShowResponse,
  MeasuresComponentResponse,
  SourcesShowResponse,
  SonarQubeError,
} from './types.js';

export class SonarQubeClient {
  public readonly baseUrl: string;
  private readonly authHeader: string;

  constructor(config: SonarQubeConfig) {
    if (!config.baseUrl) {
      throw new Error('SONARQUBE_URL is required');
    }
    if (!config.token) {
      throw new Error('SONARQUBE_TOKEN is required');
    }

    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    // SonarQube uses Basic auth with token as username, empty password
    this.authHeader = 'Basic ' + Buffer.from(`${config.token}:`).toString('base64');
  }

  private async request<T>(endpoint: string, params?: Record<string, string | string[] | number | boolean | undefined>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            url.searchParams.set(key, value.join(','));
          } else {
            url.searchParams.set(key, String(value));
          }
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': this.authHeader,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed - check SONARQUBE_TOKEN');
      }

      let errorMessage = `SonarQube API error: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.json() as SonarQubeError;
        if (errorBody.errors?.length > 0) {
          errorMessage = errorBody.errors.map(e => e.msg).join(', ');
        }
      } catch {
        // Ignore JSON parse errors, use default message
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  }

  // Projects
  async searchComponents(params: {
    qualifiers?: string;
    q?: string;
    p?: number;
    ps?: number;
  } = {}): Promise<ComponentsSearchResponse> {
    return this.request<ComponentsSearchResponse>('/api/components/search', {
      qualifiers: params.qualifiers ?? 'TRK',
      q: params.q,
      p: params.p,
      ps: params.ps,
    });
  }

  // Issues
  async searchIssues(params: {
    componentKeys?: string[];
    severities?: string[];
    types?: string[];
    files?: string[];
    branch?: string;
    sinceLeakPeriod?: boolean;
    p?: number;
    ps?: number;
  }): Promise<IssuesSearchResponse> {
    return this.request<IssuesSearchResponse>('/api/issues/search', {
      componentKeys: params.componentKeys,
      severities: params.severities,
      types: params.types,
      files: params.files,
      branch: params.branch,
      sinceLeakPeriod: params.sinceLeakPeriod,
      p: params.p,
      ps: params.ps,
    });
  }

  // Hotspots
  async searchHotspots(params: {
    projectKey: string;
    status?: string;
    branch?: string;
    p?: number;
    ps?: number;
  }): Promise<HotspotsSearchResponse> {
    return this.request<HotspotsSearchResponse>('/api/hotspots/search', {
      projectKey: params.projectKey,
      status: params.status,
      branch: params.branch,
      p: params.p,
      ps: params.ps,
    });
  }

  // Rules
  async showRule(ruleKey: string): Promise<RuleShowResponse> {
    return this.request<RuleShowResponse>('/api/rules/show', {
      key: ruleKey,
    });
  }

  // Quality Gates
  async getProjectQualityGateStatus(params: {
    projectKey: string;
    branch?: string;
  }): Promise<QualityGateProjectStatusResponse> {
    return this.request<QualityGateProjectStatusResponse>('/api/qualitygates/project_status', {
      projectKey: params.projectKey,
      branch: params.branch,
    });
  }

  async showQualityGate(params: {
    name?: string;
    id?: string;
  }): Promise<QualityGateShowResponse> {
    return this.request<QualityGateShowResponse>('/api/qualitygates/show', {
      name: params.name,
      id: params.id,
    });
  }

  // Measures
  async getComponentMeasures(params: {
    component: string;
    metricKeys: string[];
    branch?: string;
  }): Promise<MeasuresComponentResponse> {
    return this.request<MeasuresComponentResponse>('/api/measures/component', {
      component: params.component,
      metricKeys: params.metricKeys,
      branch: params.branch,
    });
  }

  // Sources
  async showSource(params: {
    key: string;
    from?: number;
    to?: number;
    branch?: string;
  }): Promise<SourcesShowResponse> {
    return this.request<SourcesShowResponse>('/api/sources/show', {
      key: params.key,
      from: params.from,
      to: params.to,
      branch: params.branch,
    });
  }
}
