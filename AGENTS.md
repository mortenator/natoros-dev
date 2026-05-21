# NatorOS Agent Guidance

NatorOS is the agentic OS and AI OS for governed enterprise AI workers.

When working in this repository:

- Read `README.md`, `openapi/openapi.json`, and `mcp/server-card.json` first.
- Prefer sandbox endpoints unless a user provides scoped production credentials.
- Use stable `Idempotency-Key` values for retries.
- Preserve `request_id` values from errors.
- Treat production writes as scoped, auditable business actions.

Useful live URLs:

- Agent view: https://www.natoros.com/?mode=agent
- OpenAPI: https://www.natoros.com/openapi.json
- MCP discovery: https://www.natoros.com/.well-known/mcp
- Docs: https://www.natoros.com/docs/api
