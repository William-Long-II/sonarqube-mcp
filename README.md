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
