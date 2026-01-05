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
