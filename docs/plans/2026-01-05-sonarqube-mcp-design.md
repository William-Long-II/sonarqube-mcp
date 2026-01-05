# SonarQube MCP Server Design

## Overview

A TypeScript/Node.js MCP server that provides code review assistance by integrating with self-hosted SonarQube Community Edition instances. Designed for npx distribution.

## Goals

- **Primary use case**: Code review assistance - fetching issues, understanding quality gate failures
- **Distribution**: npm package usable via `npx sonarqube-mcp`
- **Authentication**: User token via environment variables

## Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `SONARQUBE_URL` | Yes | Base URL of SonarQube instance (e.g., `https://sonar.example.com`) |
| `SONARQUBE_TOKEN` | Yes | User token from SonarQube (My Account > Security) |

## Tools (8 total)

### Discovery

#### `list_projects`
Search and list available projects.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | No | Search text to filter projects |
| `page` | number | No | Page number (default: 1) |
| `pageSize` | number | No | Results per page (default: 100) |

**API**: `GET /api/components/search`

---

### Issues & Hotspots

#### `get_issues`
Get issues for a project, optionally filtered by file, severity, or type.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectKey` | string | Yes | Project key |
| `severities` | string[] | No | Filter: BLOCKER, CRITICAL, MAJOR, MINOR, INFO |
| `types` | string[] | No | Filter: BUG, VULNERABILITY, CODE_SMELL |
| `files` | string[] | No | Filter by file paths |
| `branch` | string | No | Branch name |
| `newCodeOnly` | boolean | No | Only issues in new code period |
| `page` | number | No | Page number |
| `pageSize` | number | No | Results per page |

**API**: `GET /api/issues/search`

#### `get_hotspots`
Get security hotspots requiring review.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectKey` | string | Yes | Project key |
| `status` | string | No | Filter: TO_REVIEW, REVIEWED |
| `branch` | string | No | Branch name |
| `page` | number | No | Page number |
| `pageSize` | number | No | Results per page |

**API**: `GET /api/hotspots/search`

#### `get_rule`
Get detailed information about a rule.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ruleKey` | string | Yes | Rule key (e.g., `java:S1234`) |

**API**: `GET /api/rules/show`

---

### Quality Gates

#### `get_quality_gate_status`
Get quality gate status for a project.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectKey` | string | Yes | Project key |
| `branch` | string | No | Branch name |

**API**: `GET /api/qualitygates/project_status`

#### `get_quality_gate`
Get quality gate definition with conditions and thresholds.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No* | Quality gate name |
| `id` | string | No* | Quality gate ID |

*One of `name` or `id` required.

**API**: `GET /api/qualitygates/show`

---

### Metrics

#### `get_metrics`
Get metric values for a project.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectKey` | string | Yes | Project key |
| `metricKeys` | string[] | Yes | Metrics to retrieve (e.g., `coverage`, `bugs`) |
| `branch` | string | No | Branch name |

**API**: `GET /api/measures/component`

---

### Source Code

#### `get_source_with_issues`
Get source code with issue annotations.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `componentKey` | string | Yes | File component key |
| `from` | number | No | Start line |
| `to` | number | No | End line |
| `branch` | string | No | Branch name |

**API**: `GET /api/sources/show`

---

## Project Structure

```
sonarqube-mcp/
├── src/
│   ├── index.ts              # Entry point, MCP server setup
│   ├── sonarqube-client.ts   # HTTP client for SonarQube API
│   ├── tools/
│   │   ├── index.ts          # Tool registration
│   │   ├── projects.ts       # list_projects
│   │   ├── issues.ts         # get_issues
│   │   ├── rules.ts          # get_rule
│   │   ├── quality-gates.ts  # get_quality_gate_status, get_quality_gate
│   │   ├── metrics.ts        # get_metrics
│   │   ├── sources.ts        # get_source_with_issues
│   │   └── hotspots.ts       # get_hotspots
│   └── types.ts              # TypeScript types for API responses
├── package.json
├── tsconfig.json
└── README.md
```

## Dependencies

- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `zod` - Parameter validation (required by MCP SDK)

No other dependencies - uses Node.js native `fetch`.

## Authentication

SonarQube uses Basic Auth with the token as username and empty password:

```
Authorization: Basic base64(token:)
```

## Error Handling

| Error Type | Behavior |
|-----------|----------|
| Missing env vars | Fail at startup with clear message |
| Invalid token (401) | Return: "Authentication failed - check SONARQUBE_TOKEN" |
| Project not found (404) | Return: "Project 'xyz' not found" |
| Network errors | Return: "Cannot connect to SonarQube at {url}" |

## Usage

### npx (after npm publish)
```bash
SONARQUBE_URL=https://sonar.example.com SONARQUBE_TOKEN=xxx npx sonarqube-mcp
```

### Claude Desktop config
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

## Node.js Version

Requires Node.js 18+ (for native fetch support).
