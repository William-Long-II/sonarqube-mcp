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
