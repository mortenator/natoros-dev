#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const baseUrl = process.env.NATOROS_BASE_URL || "https://www.natoros.com/api";
const configPath = path.join(os.homedir(), ".natoros", "config.json");

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch {
    return {};
  }
}

function writeConfig(config) {
  fs.mkdirSync(path.dirname(configPath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), { mode: 0o600 });
}

function apiKey() {
  return process.env.NATOROS_API_KEY || readConfig().apiKey;
}

function idempotencyKey() {
  return `cli_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

async function request(pathname, { method = "GET", body, write = false } = {}) {
  const headers = { Accept: "application/json" };
  const key = apiKey();
  if (key) headers.Authorization = `Bearer ${key}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (write) headers["Idempotency-Key"] = idempotencyKey();
  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || `NatorOS request failed with HTTP ${response.status}`);
  }
  return data;
}

function readJsonArg(args) {
  const idx = args.indexOf("--json");
  if (idx === -1) return {};
  const file = args[idx + 1];
  if (!file) throw new Error("--json requires a file path");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

async function main() {
  const [, , resource = "help", action = "", ...args] = process.argv;
  if (resource === "help" || resource === "--help") {
    console.log(`Usage:
  natoros auth login --api-key <ntr_live_...>
  natoros agents list
  natoros workflows list
  natoros runs list
  natoros runs create --workflow-id <id> [--json input.json]
  natoros tasks list
  natoros tasks create --title "Follow up"
  natoros tasks update --id <id> --status done
  natoros records list --object tasks
  natoros sandbox run <workflow_id>
  natoros mcp config`);
    return;
  }

  if (resource === "auth" && action === "login") {
    const idx = args.indexOf("--api-key");
    const key = idx >= 0 ? args[idx + 1] : "";
    if (!key?.startsWith("ntr_live_")) throw new Error("Pass --api-key ntr_live_...");
    writeConfig({ ...readConfig(), apiKey: key, baseUrl });
    console.log(`Saved API key to ${configPath}`);
    return;
  }

  if (resource === "mcp" && action === "config") {
    console.log(JSON.stringify({
      mcpServers: {
        natoros: {
          url: "https://www.natoros.com/api/mcp-product",
          headers: { Authorization: "Bearer ${NATOROS_API_KEY}" },
        },
      },
    }, null, 2));
    return;
  }

  if (resource === "agents" && action === "list") return console.log(JSON.stringify(await request("/v1/agents"), null, 2));
  if (resource === "workflows" && action === "list") return console.log(JSON.stringify(await request("/v1/workflows"), null, 2));
  if (resource === "runs" && action === "list") return console.log(JSON.stringify(await request("/v1/workflow-runs"), null, 2));
  if (resource === "runs" && action === "create") {
    const workflowId = args[args.indexOf("--workflow-id") + 1];
    if (!workflowId) throw new Error("runs create requires --workflow-id");
    return console.log(JSON.stringify(await request("/v1/workflow-runs", {
      method: "POST",
      write: true,
      body: { workflow_id: workflowId, input: readJsonArg(args) },
    }), null, 2));
  }
  if (resource === "tasks" && action === "list") return console.log(JSON.stringify(await request("/v1/tasks"), null, 2));
  if (resource === "tasks" && action === "create") {
    const title = args[args.indexOf("--title") + 1];
    if (!title) throw new Error("tasks create requires --title");
    return console.log(JSON.stringify(await request("/v1/tasks", { method: "POST", write: true, body: { title } }), null, 2));
  }
  if (resource === "tasks" && action === "update") {
    const id = args[args.indexOf("--id") + 1];
    if (!id) throw new Error("tasks update requires --id");
    const status = args[args.indexOf("--status") + 1];
    return console.log(JSON.stringify(await request("/v1/tasks", { method: "PATCH", write: true, body: { id, status } }), null, 2));
  }
  if (resource === "records" && action === "list") {
    const object = args[args.indexOf("--object") + 1] || "tasks";
    return console.log(JSON.stringify(await request(`/v1/records?object=${encodeURIComponent(object)}`), null, 2));
  }
  if (resource === "sandbox" && action === "run") {
    const workflowId = args[0] || "wf_weekly_pipeline_summary";
    return console.log(JSON.stringify(await request("/v1/sandbox/workflow-runs", {
      method: "POST",
      body: { workflow_id: workflowId, input: { source: "natoros-cli" } },
    }), null, 2));
  }

  process.exitCode = 1;
  console.error("Unknown command. Run: natoros help");
}

main().catch((error) => {
  process.exitCode = 1;
  console.error(error.message);
});
