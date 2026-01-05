# SonarQube MCP Server Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a TypeScript MCP server that provides 8 tools for SonarQube code review assistance, distributable via npx.

**Architecture:** Modular tool structure with shared SonarQube HTTP client. Uses stdio transport for MCP communication. Environment variables for configuration.

**Tech Stack:** TypeScript, @modelcontextprotocol/sdk, zod, Node.js 18+ native fetch

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`

**Step 1: Create package.json**

```json
{
  "name": "sonarqube-mcp",
  "version": "1.0.0",
  "description": "MCP server for SonarQube code review assistance",
  "type": "module",
  "main": "dist/index.js",
  "bin": {
    "sonarqube-mcp": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "start": "node dist/index.js",
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["mcp", "sonarqube", "code-review", "static-analysis"],
  "author": "",
  "license": "MIT",
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Create .gitignore**

```
node_modules/
dist/
.env
*.log
.DS_Store
```

**Step 4: Install dependencies**

Run: `npm install`
Expected: Dependencies installed, package-lock.json created

**Step 5: Commit**

```bash
git add package.json tsconfig.json .gitignore package-lock.json
git commit -m "chore: initialize project with TypeScript and MCP SDK"
```

---

## Task 2: Jest Configuration

**Files:**
- Create: `jest.config.js`

**Step 1: Create jest.config.js**

```javascript
/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
};
```

**Step 2: Verify Jest works**

Run: `npm test`
Expected: "No tests found" (not an error, just no tests yet)

**Step 3: Commit**

```bash
git add jest.config.js
git commit -m "chore: add Jest configuration for ESM TypeScript"
```

---

## Task 3: SonarQube Client - Types

**Files:**
- Create: `src/types.ts`

**Step 1: Create types file**

```typescript
// SonarQube API response types

export interface SonarQubeConfig {
  baseUrl: string;
  token: string;
}

export interface PagingInfo {
  pageIndex: number;
  pageSize: number;
  total: number;
}

// Projects/Components
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

// Issues
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

// Hotspots
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

// Rules
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

// Quality Gates
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

// Measures
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

// Sources
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

// API Error
export interface SonarQubeError {
  errors: Array<{ msg: string }>;
}
```

**Step 2: Commit**

```bash
git add src/types.ts
git commit -m "feat: add TypeScript types for SonarQube API responses"
```

---

## Task 4: SonarQube Client - Implementation

**Files:**
- Create: `src/sonarqube-client.ts`
- Create: `src/sonarqube-client.test.ts`

**Step 1: Write failing test for client construction**

```typescript
// src/sonarqube-client.test.ts
import { SonarQubeClient } from './sonarqube-client.js';

describe('SonarQubeClient', () => {
  describe('constructor', () => {
    it('should create client with valid config', () => {
      const client = new SonarQubeClient({
        baseUrl: 'https://sonar.example.com',
        token: 'test-token',
      });
      expect(client).toBeInstanceOf(SonarQubeClient);
    });

    it('should throw if baseUrl is missing', () => {
      expect(() => new SonarQubeClient({ baseUrl: '', token: 'test' }))
        .toThrow('SONARQUBE_URL is required');
    });

    it('should throw if token is missing', () => {
      expect(() => new SonarQubeClient({ baseUrl: 'https://sonar.example.com', token: '' }))
        .toThrow('SONARQUBE_TOKEN is required');
    });

    it('should normalize baseUrl by removing trailing slash', () => {
      const client = new SonarQubeClient({
        baseUrl: 'https://sonar.example.com/',
        token: 'test-token',
      });
      expect(client.baseUrl).toBe('https://sonar.example.com');
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - Cannot find module './sonarqube-client.js'

**Step 3: Write SonarQube client implementation**

```typescript
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
```

**Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/sonarqube-client.ts src/sonarqube-client.test.ts
git commit -m "feat: implement SonarQube HTTP client with all API methods"
```

---

## Task 5: Tool - list_projects

**Files:**
- Create: `src/tools/projects.ts`
- Create: `src/tools/projects.test.ts`

**Step 1: Write failing test**

```typescript
// src/tools/projects.test.ts
import { listProjectsTool } from './projects.js';

describe('listProjectsTool', () => {
  it('should have correct tool definition', () => {
    expect(listProjectsTool.name).toBe('list_projects');
    expect(listProjectsTool.description).toContain('project');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - Cannot find module './projects.js'

**Step 3: Implement list_projects tool**

```typescript
// src/tools/projects.ts
import { z } from 'zod';
import type { SonarQubeClient } from '../sonarqube-client.js';

export const listProjectsSchema = {
  query: z.string().optional().describe('Search text to filter projects by name'),
  page: z.number().optional().describe('Page number (default: 1)'),
  pageSize: z.number().optional().describe('Results per page (default: 100, max: 500)'),
};

export const listProjectsTool = {
  name: 'list_projects',
  description: 'Search and list available SonarQube projects. Use this to discover project keys for other tools.',
  schema: listProjectsSchema,
};

export async function handleListProjects(
  client: SonarQubeClient,
  params: {
    query?: string;
    page?: number;
    pageSize?: number;
  }
) {
  const response = await client.searchComponents({
    qualifiers: 'TRK',
    q: params.query,
    p: params.page,
    ps: params.pageSize,
  });

  const projects = response.components.map(c => ({
    key: c.key,
    name: c.name,
    lastAnalysisDate: c.lastAnalysisDate,
  }));

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify({
          projects,
          paging: {
            page: response.paging.pageIndex,
            pageSize: response.paging.pageSize,
            total: response.paging.total,
          },
        }, null, 2),
      },
    ],
  };
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/tools/projects.ts src/tools/projects.test.ts
git commit -m "feat: add list_projects tool"
```

---

## Task 6: Tool - get_issues

**Files:**
- Create: `src/tools/issues.ts`
- Create: `src/tools/issues.test.ts`

**Step 1: Write failing test**

```typescript
// src/tools/issues.test.ts
import { getIssuesTool } from './issues.js';

describe('getIssuesTool', () => {
  it('should have correct tool definition', () => {
    expect(getIssuesTool.name).toBe('get_issues');
    expect(getIssuesTool.description).toContain('issues');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - Cannot find module './issues.js'

**Step 3: Implement get_issues tool**

```typescript
// src/tools/issues.ts
import { z } from 'zod';
import type { SonarQubeClient } from '../sonarqube-client.js';

export const getIssuesSchema = {
  projectKey: z.string().describe('Project key (required)'),
  severities: z.array(z.enum(['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'INFO'])).optional()
    .describe('Filter by severities'),
  types: z.array(z.enum(['BUG', 'VULNERABILITY', 'CODE_SMELL'])).optional()
    .describe('Filter by issue types'),
  files: z.array(z.string()).optional().describe('Filter by file paths'),
  branch: z.string().optional().describe('Branch name'),
  newCodeOnly: z.boolean().optional().describe('Only show issues in new code period'),
  page: z.number().optional().describe('Page number (default: 1)'),
  pageSize: z.number().optional().describe('Results per page (default: 100, max: 500)'),
};

export const getIssuesTool = {
  name: 'get_issues',
  description: 'Get issues (bugs, vulnerabilities, code smells) for a SonarQube project. Can filter by severity, type, file path, and whether issues are in new code.',
  schema: getIssuesSchema,
};

export async function handleGetIssues(
  client: SonarQubeClient,
  params: {
    projectKey: string;
    severities?: ('BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO')[];
    types?: ('BUG' | 'VULNERABILITY' | 'CODE_SMELL')[];
    files?: string[];
    branch?: string;
    newCodeOnly?: boolean;
    page?: number;
    pageSize?: number;
  }
) {
  const response = await client.searchIssues({
    componentKeys: [params.projectKey],
    severities: params.severities,
    types: params.types,
    files: params.files,
    branch: params.branch,
    sinceLeakPeriod: params.newCodeOnly,
    p: params.page,
    ps: params.pageSize,
  });

  const issues = response.issues.map(issue => ({
    key: issue.key,
    rule: issue.rule,
    severity: issue.severity,
    type: issue.type,
    component: issue.component,
    line: issue.line,
    message: issue.message,
    status: issue.status,
    creationDate: issue.creationDate,
    tags: issue.tags,
  }));

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify({
          issues,
          paging: {
            page: response.paging.pageIndex,
            pageSize: response.paging.pageSize,
            total: response.paging.total,
          },
        }, null, 2),
      },
    ],
  };
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/tools/issues.ts src/tools/issues.test.ts
git commit -m "feat: add get_issues tool"
```

---

## Task 7: Tool - get_hotspots

**Files:**
- Create: `src/tools/hotspots.ts`
- Create: `src/tools/hotspots.test.ts`

**Step 1: Write failing test**

```typescript
// src/tools/hotspots.test.ts
import { getHotspotsTool } from './hotspots.js';

describe('getHotspotsTool', () => {
  it('should have correct tool definition', () => {
    expect(getHotspotsTool.name).toBe('get_hotspots');
    expect(getHotspotsTool.description).toContain('hotspot');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - Cannot find module './hotspots.js'

**Step 3: Implement get_hotspots tool**

```typescript
// src/tools/hotspots.ts
import { z } from 'zod';
import type { SonarQubeClient } from '../sonarqube-client.js';

export const getHotspotsSchema = {
  projectKey: z.string().describe('Project key (required)'),
  status: z.enum(['TO_REVIEW', 'REVIEWED']).optional().describe('Filter by review status'),
  branch: z.string().optional().describe('Branch name'),
  page: z.number().optional().describe('Page number (default: 1)'),
  pageSize: z.number().optional().describe('Results per page (default: 100, max: 500)'),
};

export const getHotspotsTool = {
  name: 'get_hotspots',
  description: 'Get security hotspots for a SonarQube project. Hotspots are potential security issues that require manual review.',
  schema: getHotspotsSchema,
};

export async function handleGetHotspots(
  client: SonarQubeClient,
  params: {
    projectKey: string;
    status?: 'TO_REVIEW' | 'REVIEWED';
    branch?: string;
    page?: number;
    pageSize?: number;
  }
) {
  const response = await client.searchHotspots({
    projectKey: params.projectKey,
    status: params.status,
    branch: params.branch,
    p: params.page,
    ps: params.pageSize,
  });

  const hotspots = response.hotspots.map(h => ({
    key: h.key,
    component: h.component,
    securityCategory: h.securityCategory,
    vulnerabilityProbability: h.vulnerabilityProbability,
    status: h.status,
    line: h.line,
    message: h.message,
    creationDate: h.creationDate,
  }));

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify({
          hotspots,
          paging: {
            page: response.paging.pageIndex,
            pageSize: response.paging.pageSize,
            total: response.paging.total,
          },
        }, null, 2),
      },
    ],
  };
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/tools/hotspots.ts src/tools/hotspots.test.ts
git commit -m "feat: add get_hotspots tool"
```

---

## Task 8: Tool - get_rule

**Files:**
- Create: `src/tools/rules.ts`
- Create: `src/tools/rules.test.ts`

**Step 1: Write failing test**

```typescript
// src/tools/rules.test.ts
import { getRuleTool } from './rules.js';

describe('getRuleTool', () => {
  it('should have correct tool definition', () => {
    expect(getRuleTool.name).toBe('get_rule');
    expect(getRuleTool.description).toContain('rule');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - Cannot find module './rules.js'

**Step 3: Implement get_rule tool**

```typescript
// src/tools/rules.ts
import { z } from 'zod';
import type { SonarQubeClient } from '../sonarqube-client.js';

export const getRuleSchema = {
  ruleKey: z.string().describe('Rule key (e.g., java:S1234, typescript:S2077)'),
};

export const getRuleTool = {
  name: 'get_rule',
  description: 'Get detailed information about a SonarQube rule, including its description, severity, and how to fix violations.',
  schema: getRuleSchema,
};

export async function handleGetRule(
  client: SonarQubeClient,
  params: {
    ruleKey: string;
  }
) {
  const response = await client.showRule(params.ruleKey);
  const rule = response.rule;

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify({
          key: rule.key,
          name: rule.name,
          severity: rule.severity,
          type: rule.type,
          language: rule.langName || rule.lang,
          tags: rule.tags,
          description: rule.mdDesc || rule.htmlDesc,
        }, null, 2),
      },
    ],
  };
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/tools/rules.ts src/tools/rules.test.ts
git commit -m "feat: add get_rule tool"
```

---

## Task 9: Tool - get_quality_gate_status

**Files:**
- Create: `src/tools/quality-gates.ts`
- Create: `src/tools/quality-gates.test.ts`

**Step 1: Write failing test**

```typescript
// src/tools/quality-gates.test.ts
import { getQualityGateStatusTool, getQualityGateTool } from './quality-gates.js';

describe('quality gate tools', () => {
  it('should have correct get_quality_gate_status definition', () => {
    expect(getQualityGateStatusTool.name).toBe('get_quality_gate_status');
    expect(getQualityGateStatusTool.description).toContain('quality gate');
  });

  it('should have correct get_quality_gate definition', () => {
    expect(getQualityGateTool.name).toBe('get_quality_gate');
    expect(getQualityGateTool.description).toContain('quality gate');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - Cannot find module './quality-gates.js'

**Step 3: Implement quality gate tools**

```typescript
// src/tools/quality-gates.ts
import { z } from 'zod';
import type { SonarQubeClient } from '../sonarqube-client.js';

// get_quality_gate_status
export const getQualityGateStatusSchema = {
  projectKey: z.string().describe('Project key (required)'),
  branch: z.string().optional().describe('Branch name'),
};

export const getQualityGateStatusTool = {
  name: 'get_quality_gate_status',
  description: 'Get the quality gate status for a project. Shows pass/fail status and which conditions failed. Use this to understand why a build failed quality checks.',
  schema: getQualityGateStatusSchema,
};

export async function handleGetQualityGateStatus(
  client: SonarQubeClient,
  params: {
    projectKey: string;
    branch?: string;
  }
) {
  const response = await client.getProjectQualityGateStatus({
    projectKey: params.projectKey,
    branch: params.branch,
  });

  const status = response.projectStatus;
  const failedConditions = status.conditions.filter(c => c.status === 'ERROR');
  const warningConditions = status.conditions.filter(c => c.status === 'WARN');

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify({
          status: status.status,
          passed: status.status === 'OK',
          failedConditions: failedConditions.map(c => ({
            metric: c.metricKey,
            comparator: c.comparator,
            threshold: c.errorThreshold,
            actual: c.actualValue,
          })),
          warningConditions: warningConditions.map(c => ({
            metric: c.metricKey,
            comparator: c.comparator,
            threshold: c.errorThreshold,
            actual: c.actualValue,
          })),
          allConditions: status.conditions.map(c => ({
            metric: c.metricKey,
            status: c.status,
            comparator: c.comparator,
            threshold: c.errorThreshold,
            actual: c.actualValue,
          })),
        }, null, 2),
      },
    ],
  };
}

// get_quality_gate
export const getQualityGateSchema = {
  name: z.string().optional().describe('Quality gate name'),
  id: z.string().optional().describe('Quality gate ID'),
};

export const getQualityGateTool = {
  name: 'get_quality_gate',
  description: 'Get the definition of a quality gate, including all conditions and thresholds. Use this to understand what requirements a project must meet.',
  schema: getQualityGateSchema,
};

export async function handleGetQualityGate(
  client: SonarQubeClient,
  params: {
    name?: string;
    id?: string;
  }
) {
  if (!params.name && !params.id) {
    throw new Error('Either name or id is required');
  }

  const response = await client.showQualityGate({
    name: params.name,
    id: params.id,
  });

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify({
          id: response.id,
          name: response.name,
          isDefault: response.isDefault,
          isBuiltIn: response.isBuiltIn,
          conditions: response.conditions?.map(c => ({
            id: c.id,
            metric: c.metric,
            operator: c.op,
            errorThreshold: c.error,
          })),
        }, null, 2),
      },
    ],
  };
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/tools/quality-gates.ts src/tools/quality-gates.test.ts
git commit -m "feat: add get_quality_gate_status and get_quality_gate tools"
```

---

## Task 10: Tool - get_metrics

**Files:**
- Create: `src/tools/metrics.ts`
- Create: `src/tools/metrics.test.ts`

**Step 1: Write failing test**

```typescript
// src/tools/metrics.test.ts
import { getMetricsTool } from './metrics.js';

describe('getMetricsTool', () => {
  it('should have correct tool definition', () => {
    expect(getMetricsTool.name).toBe('get_metrics');
    expect(getMetricsTool.description).toContain('metric');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - Cannot find module './metrics.js'

**Step 3: Implement get_metrics tool**

```typescript
// src/tools/metrics.ts
import { z } from 'zod';
import type { SonarQubeClient } from '../sonarqube-client.js';

export const getMetricsSchema = {
  projectKey: z.string().describe('Project key (required)'),
  metricKeys: z.array(z.string()).describe('Metric keys to retrieve (e.g., coverage, bugs, vulnerabilities, code_smells, duplicated_lines_density)'),
  branch: z.string().optional().describe('Branch name'),
};

export const getMetricsTool = {
  name: 'get_metrics',
  description: 'Get metric values for a project. Common metrics: coverage, bugs, vulnerabilities, code_smells, duplicated_lines_density, ncloc (lines of code), sqale_index (technical debt).',
  schema: getMetricsSchema,
};

export async function handleGetMetrics(
  client: SonarQubeClient,
  params: {
    projectKey: string;
    metricKeys: string[];
    branch?: string;
  }
) {
  const response = await client.getComponentMeasures({
    component: params.projectKey,
    metricKeys: params.metricKeys,
    branch: params.branch,
  });

  const measures = response.component.measures.reduce((acc, m) => {
    acc[m.metric] = m.value ?? m.period?.value;
    return acc;
  }, {} as Record<string, string | undefined>);

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify({
          project: response.component.key,
          projectName: response.component.name,
          metrics: measures,
        }, null, 2),
      },
    ],
  };
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/tools/metrics.ts src/tools/metrics.test.ts
git commit -m "feat: add get_metrics tool"
```

---

## Task 11: Tool - get_source_with_issues

**Files:**
- Create: `src/tools/sources.ts`
- Create: `src/tools/sources.test.ts`

**Step 1: Write failing test**

```typescript
// src/tools/sources.test.ts
import { getSourceWithIssuesTool } from './sources.js';

describe('getSourceWithIssuesTool', () => {
  it('should have correct tool definition', () => {
    expect(getSourceWithIssuesTool.name).toBe('get_source_with_issues');
    expect(getSourceWithIssuesTool.description).toContain('source');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - Cannot find module './sources.js'

**Step 3: Implement get_source_with_issues tool**

```typescript
// src/tools/sources.ts
import { z } from 'zod';
import type { SonarQubeClient } from '../sonarqube-client.js';

export const getSourceWithIssuesSchema = {
  componentKey: z.string().describe('File component key (e.g., project:src/main/java/File.java)'),
  from: z.number().optional().describe('Start line number'),
  to: z.number().optional().describe('End line number'),
  branch: z.string().optional().describe('Branch name'),
};

export const getSourceWithIssuesTool = {
  name: 'get_source_with_issues',
  description: 'Get source code for a file. Use in combination with get_issues to see the actual code at issue locations.',
  schema: getSourceWithIssuesSchema,
};

export async function handleGetSourceWithIssues(
  client: SonarQubeClient,
  params: {
    componentKey: string;
    from?: number;
    to?: number;
    branch?: string;
  }
) {
  const response = await client.showSource({
    key: params.componentKey,
    from: params.from,
    to: params.to,
    branch: params.branch,
  });

  const lines = response.sources.map(s => ({
    line: s.line,
    code: s.code,
  }));

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify({
          component: params.componentKey,
          fromLine: params.from,
          toLine: params.to,
          lines,
        }, null, 2),
      },
    ],
  };
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/tools/sources.ts src/tools/sources.test.ts
git commit -m "feat: add get_source_with_issues tool"
```

---

## Task 12: Tools Index

**Files:**
- Create: `src/tools/index.ts`

**Step 1: Create tools index**

```typescript
// src/tools/index.ts
export { listProjectsTool, listProjectsSchema, handleListProjects } from './projects.js';
export { getIssuesTool, getIssuesSchema, handleGetIssues } from './issues.js';
export { getHotspotsTool, getHotspotsSchema, handleGetHotspots } from './hotspots.js';
export { getRuleTool, getRuleSchema, handleGetRule } from './rules.js';
export {
  getQualityGateStatusTool,
  getQualityGateStatusSchema,
  handleGetQualityGateStatus,
  getQualityGateTool,
  getQualityGateSchema,
  handleGetQualityGate,
} from './quality-gates.js';
export { getMetricsTool, getMetricsSchema, handleGetMetrics } from './metrics.js';
export { getSourceWithIssuesTool, getSourceWithIssuesSchema, handleGetSourceWithIssues } from './sources.js';
```

**Step 2: Commit**

```bash
git add src/tools/index.ts
git commit -m "feat: add tools index for exports"
```

---

## Task 13: MCP Server Entry Point

**Files:**
- Create: `src/index.ts`

**Step 1: Create MCP server entry point**

```typescript
#!/usr/bin/env node
// src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { SonarQubeClient } from './sonarqube-client.js';
import {
  listProjectsSchema,
  handleListProjects,
  getIssuesSchema,
  handleGetIssues,
  getHotspotsSchema,
  handleGetHotspots,
  getRuleSchema,
  handleGetRule,
  getQualityGateStatusSchema,
  handleGetQualityGateStatus,
  getQualityGateSchema,
  handleGetQualityGate,
  getMetricsSchema,
  handleGetMetrics,
  getSourceWithIssuesSchema,
  handleGetSourceWithIssues,
} from './tools/index.js';

// Validate environment variables
const SONARQUBE_URL = process.env.SONARQUBE_URL;
const SONARQUBE_TOKEN = process.env.SONARQUBE_TOKEN;

if (!SONARQUBE_URL) {
  console.error('Error: SONARQUBE_URL environment variable is required');
  process.exit(1);
}

if (!SONARQUBE_TOKEN) {
  console.error('Error: SONARQUBE_TOKEN environment variable is required');
  process.exit(1);
}

// Create SonarQube client
const client = new SonarQubeClient({
  baseUrl: SONARQUBE_URL,
  token: SONARQUBE_TOKEN,
});

// Create MCP server
const server = new McpServer({
  name: 'sonarqube-mcp',
  version: '1.0.0',
});

// Register tools
server.tool(
  'list_projects',
  'Search and list available SonarQube projects. Use this to discover project keys for other tools.',
  {
    query: z.string().optional().describe('Search text to filter projects by name'),
    page: z.number().optional().describe('Page number (default: 1)'),
    pageSize: z.number().optional().describe('Results per page (default: 100, max: 500)'),
  },
  async (params) => handleListProjects(client, params)
);

server.tool(
  'get_issues',
  'Get issues (bugs, vulnerabilities, code smells) for a SonarQube project. Can filter by severity, type, file path, and whether issues are in new code.',
  {
    projectKey: z.string().describe('Project key (required)'),
    severities: z.array(z.enum(['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'INFO'])).optional()
      .describe('Filter by severities'),
    types: z.array(z.enum(['BUG', 'VULNERABILITY', 'CODE_SMELL'])).optional()
      .describe('Filter by issue types'),
    files: z.array(z.string()).optional().describe('Filter by file paths'),
    branch: z.string().optional().describe('Branch name'),
    newCodeOnly: z.boolean().optional().describe('Only show issues in new code period'),
    page: z.number().optional().describe('Page number (default: 1)'),
    pageSize: z.number().optional().describe('Results per page (default: 100, max: 500)'),
  },
  async (params) => handleGetIssues(client, params)
);

server.tool(
  'get_hotspots',
  'Get security hotspots for a SonarQube project. Hotspots are potential security issues that require manual review.',
  {
    projectKey: z.string().describe('Project key (required)'),
    status: z.enum(['TO_REVIEW', 'REVIEWED']).optional().describe('Filter by review status'),
    branch: z.string().optional().describe('Branch name'),
    page: z.number().optional().describe('Page number (default: 1)'),
    pageSize: z.number().optional().describe('Results per page (default: 100, max: 500)'),
  },
  async (params) => handleGetHotspots(client, params)
);

server.tool(
  'get_rule',
  'Get detailed information about a SonarQube rule, including its description, severity, and how to fix violations.',
  {
    ruleKey: z.string().describe('Rule key (e.g., java:S1234, typescript:S2077)'),
  },
  async (params) => handleGetRule(client, params)
);

server.tool(
  'get_quality_gate_status',
  'Get the quality gate status for a project. Shows pass/fail status and which conditions failed. Use this to understand why a build failed quality checks.',
  {
    projectKey: z.string().describe('Project key (required)'),
    branch: z.string().optional().describe('Branch name'),
  },
  async (params) => handleGetQualityGateStatus(client, params)
);

server.tool(
  'get_quality_gate',
  'Get the definition of a quality gate, including all conditions and thresholds. Use this to understand what requirements a project must meet.',
  {
    name: z.string().optional().describe('Quality gate name'),
    id: z.string().optional().describe('Quality gate ID'),
  },
  async (params) => handleGetQualityGate(client, params)
);

server.tool(
  'get_metrics',
  'Get metric values for a project. Common metrics: coverage, bugs, vulnerabilities, code_smells, duplicated_lines_density, ncloc (lines of code), sqale_index (technical debt).',
  {
    projectKey: z.string().describe('Project key (required)'),
    metricKeys: z.array(z.string()).describe('Metric keys to retrieve'),
    branch: z.string().optional().describe('Branch name'),
  },
  async (params) => handleGetMetrics(client, params)
);

server.tool(
  'get_source_with_issues',
  'Get source code for a file. Use in combination with get_issues to see the actual code at issue locations.',
  {
    componentKey: z.string().describe('File component key (e.g., project:src/main/java/File.java)'),
    from: z.number().optional().describe('Start line number'),
    to: z.number().optional().describe('End line number'),
    branch: z.string().optional().describe('Branch name'),
  },
  async (params) => handleGetSourceWithIssues(client, params)
);

// Start server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('SonarQube MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
```

**Step 2: Commit**

```bash
git add src/index.ts
git commit -m "feat: add MCP server entry point with all tools registered"
```

---

## Task 14: Build and Test

**Step 1: Build the project**

Run: `npm run build`
Expected: Compiles without errors, creates dist/ directory

**Step 2: Run all tests**

Run: `npm test`
Expected: All tests pass

**Step 3: Commit build artifacts to gitignore verification**

```bash
git status
```
Expected: dist/ should not appear (it's in .gitignore)

**Step 4: Commit any remaining changes**

```bash
git add -A
git commit -m "chore: verify build and tests pass"
```

---

## Task 15: README Documentation

**Files:**
- Create: `README.md`

**Step 1: Create README**

```markdown
# sonarqube-mcp

An MCP (Model Context Protocol) server for SonarQube code review assistance. Provides tools to query issues, quality gates, metrics, and more from your SonarQube instance.

## Installation

```bash
npx sonarqube-mcp
```

Or install globally:

```bash
npm install -g sonarqube-mcp
```

## Configuration

Set the following environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `SONARQUBE_URL` | Yes | Base URL of your SonarQube instance |
| `SONARQUBE_TOKEN` | Yes | User token from SonarQube (My Account > Security) |

## Usage with Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "sonarqube": {
      "command": "npx",
      "args": ["-y", "sonarqube-mcp"],
      "env": {
        "SONARQUBE_URL": "https://sonar.example.com",
        "SONARQUBE_TOKEN": "your-token-here"
      }
    }
  }
}
```

## Available Tools

### list_projects
Search and list available SonarQube projects.

### get_issues
Get issues (bugs, vulnerabilities, code smells) for a project. Supports filtering by severity, type, file, and new code only.

### get_hotspots
Get security hotspots requiring manual review.

### get_rule
Get detailed information about a rule, including description and fix guidance.

### get_quality_gate_status
Check if a project passes its quality gate. Shows which conditions failed.

### get_quality_gate
Get the definition of a quality gate with all conditions and thresholds.

### get_metrics
Get metric values (coverage, bugs, etc.) for a project.

### get_source_with_issues
View source code for a file to see code at issue locations.

## Example Queries

- "What issues are in my-project?"
- "Why did my-project fail its quality gate?"
- "Show me the coverage metrics for my-project"
- "What does rule java:S1234 mean?"
- "List all critical vulnerabilities in my-project"

## License

MIT
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with installation and usage instructions"
```

---

## Task 16: Final Verification

**Step 1: Clean build**

Run: `rm -rf dist && npm run build`
Expected: Clean compile

**Step 2: Test with environment variables**

Run: `SONARQUBE_URL=https://test.example.com SONARQUBE_TOKEN=test node dist/index.js`
Expected: Outputs "SonarQube MCP server running on stdio" to stderr

**Step 3: Tag release**

```bash
git tag v1.0.0
git log --oneline -10
```

**Step 4: Ready for npm publish**

When ready to publish:
```bash
npm publish
```

---

## Summary

This plan creates a complete MCP server with:
- 8 tools for SonarQube code review assistance
- TypeScript with full type safety
- Jest tests for all tools
- npx-compatible distribution
- Comprehensive README

Total tasks: 16
Estimated implementation: Sequential execution following TDD
