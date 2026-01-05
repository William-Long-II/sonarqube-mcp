#!/usr/bin/env node
// src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { SonarQubeClient } from './sonarqube-client.js';
import { handleListProjects, handleGetIssues, handleGetHotspots, handleGetRule, handleGetQualityGateStatus, handleGetQualityGate, handleGetMetrics, handleGetSourceWithIssues, } from './tools/index.js';
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
server.tool('list_projects', 'Search and list available SonarQube projects. Use this to discover project keys for other tools.', {
    query: z.string().optional().describe('Search text to filter projects by name'),
    page: z.number().optional().describe('Page number (default: 1)'),
    pageSize: z.number().optional().describe('Results per page (default: 100, max: 500)'),
}, async (params) => handleListProjects(client, params));
server.tool('get_issues', 'Get issues (bugs, vulnerabilities, code smells) for a SonarQube project. Can filter by severity, type, file path, and whether issues are in new code.', {
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
}, async (params) => handleGetIssues(client, params));
server.tool('get_hotspots', 'Get security hotspots for a SonarQube project. Hotspots are potential security issues that require manual review.', {
    projectKey: z.string().describe('Project key (required)'),
    status: z.enum(['TO_REVIEW', 'REVIEWED']).optional().describe('Filter by review status'),
    branch: z.string().optional().describe('Branch name'),
    page: z.number().optional().describe('Page number (default: 1)'),
    pageSize: z.number().optional().describe('Results per page (default: 100, max: 500)'),
}, async (params) => handleGetHotspots(client, params));
server.tool('get_rule', 'Get detailed information about a SonarQube rule, including its description, severity, and how to fix violations.', {
    ruleKey: z.string().describe('Rule key (e.g., java:S1234, typescript:S2077)'),
}, async (params) => handleGetRule(client, params));
server.tool('get_quality_gate_status', 'Get the quality gate status for a project. Shows pass/fail status and which conditions failed. Use this to understand why a build failed quality checks.', {
    projectKey: z.string().describe('Project key (required)'),
    branch: z.string().optional().describe('Branch name'),
}, async (params) => handleGetQualityGateStatus(client, params));
server.tool('get_quality_gate', 'Get the definition of a quality gate, including all conditions and thresholds. Use this to understand what requirements a project must meet.', {
    name: z.string().optional().describe('Quality gate name'),
    id: z.string().optional().describe('Quality gate ID'),
}, async (params) => handleGetQualityGate(client, params));
server.tool('get_metrics', 'Get metric values for a project. Common metrics: coverage, bugs, vulnerabilities, code_smells, duplicated_lines_density, ncloc (lines of code), sqale_index (technical debt).', {
    projectKey: z.string().describe('Project key (required)'),
    metricKeys: z.array(z.string()).describe('Metric keys to retrieve'),
    branch: z.string().optional().describe('Branch name'),
}, async (params) => handleGetMetrics(client, params));
server.tool('get_source_with_issues', 'Get source code for a file. Use in combination with get_issues to see the actual code at issue locations.', {
    componentKey: z.string().describe('File component key (e.g., project:src/main/java/File.java)'),
    from: z.number().optional().describe('Start line number'),
    to: z.number().optional().describe('End line number'),
    branch: z.string().optional().describe('Branch name'),
}, async (params) => handleGetSourceWithIssues(client, params));
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
//# sourceMappingURL=index.js.map