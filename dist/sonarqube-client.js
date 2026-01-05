export class SonarQubeClient {
    baseUrl;
    authHeader;
    constructor(config) {
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
    async request(endpoint, params) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined) {
                    if (Array.isArray(value)) {
                        url.searchParams.set(key, value.join(','));
                    }
                    else {
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
                const errorBody = await response.json();
                if (errorBody.errors?.length > 0) {
                    errorMessage = errorBody.errors.map(e => e.msg).join(', ');
                }
            }
            catch {
                // Ignore JSON parse errors, use default message
            }
            throw new Error(errorMessage);
        }
        return response.json();
    }
    // Projects
    async searchComponents(params = {}) {
        return this.request('/api/components/search', {
            qualifiers: params.qualifiers ?? 'TRK',
            q: params.q,
            p: params.p,
            ps: params.ps,
        });
    }
    // Issues
    async searchIssues(params) {
        return this.request('/api/issues/search', {
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
    async searchHotspots(params) {
        return this.request('/api/hotspots/search', {
            projectKey: params.projectKey,
            status: params.status,
            branch: params.branch,
            p: params.p,
            ps: params.ps,
        });
    }
    // Rules
    async showRule(ruleKey) {
        return this.request('/api/rules/show', {
            key: ruleKey,
        });
    }
    // Quality Gates
    async getProjectQualityGateStatus(params) {
        return this.request('/api/qualitygates/project_status', {
            projectKey: params.projectKey,
            branch: params.branch,
        });
    }
    async showQualityGate(params) {
        return this.request('/api/qualitygates/show', {
            name: params.name,
            id: params.id,
        });
    }
    // Measures
    async getComponentMeasures(params) {
        return this.request('/api/measures/component', {
            component: params.component,
            metricKeys: params.metricKeys,
            branch: params.branch,
        });
    }
    // Sources
    async showSource(params) {
        return this.request('/api/sources/show', {
            key: params.key,
            from: params.from,
            to: params.to,
            branch: params.branch,
        });
    }
}
//# sourceMappingURL=sonarqube-client.js.map