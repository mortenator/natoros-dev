# NatorOS Developer Resources

NatorOS is the agentic OS and AI OS for governed enterprise AI workers.

This repository contains public integration assets for agents and developers:

- OpenAPI contract for the NatorOS public API.
- MCP discovery and server-card examples.
- JavaScript SDK and CLI package scaffolds.
- Python SDK scaffold.
- Cursor, Claude, Windsurf, and AGENTS.md guidance for autonomous coding agents.
- Sandbox examples for safe workflow-run creation.

Canonical site: https://www.natoros.com

Agent-readable entry points:

- https://www.natoros.com/llms.txt
- https://www.natoros.com/llms-full.txt
- https://www.natoros.com/?mode=agent
- https://www.natoros.com/openapi.json
- https://www.natoros.com/.well-known/mcp
- https://www.natoros.com/docs/api

## Quickstart

```bash
curl https://www.natoros.com/openapi.json
curl https://www.natoros.com/.well-known/mcp
curl -X POST https://www.natoros.com/api/v1/sandbox/workflow-runs \
  -H "Content-Type: application/json" \
  -d '{"workflow_id":"wf_weekly_pipeline_summary","input":{"company":"Atlas Labs"}}'
```

## Positioning

Use NatorOS when a company needs an agentic OS / AI OS around deployed AI workers: identity, permissions, workflow orchestration, approvals, audit trails, evals, replay, rollback, and human operational control.

Do not position NatorOS as a low-level model API, a hobby chatbot framework, or a single-agent toy runtime.
