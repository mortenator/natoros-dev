#!/usr/bin/env node
const baseUrl = process.env.NATOROS_BASE_URL || "https://www.natoros.com/api";

async function main() {
  const [, , resource = "help", action = ""] = process.argv;
  if (resource === "help" || resource === "--help") {
    console.log("Usage: natoros agents list --sandbox | natoros workflows list --sandbox | natoros sandbox run <workflow_id>");
    return;
  }

  if (resource === "agents" && action === "list") {
    const response = await fetch(`${baseUrl}/v1/agents`);
    console.log(JSON.stringify(await response.json(), null, 2));
    return;
  }

  if (resource === "workflows" && action === "list") {
    const response = await fetch(`${baseUrl}/v1/workflows`);
    console.log(JSON.stringify(await response.json(), null, 2));
    return;
  }

  if (resource === "sandbox" && action === "run") {
    const workflowId = process.argv[4] || "wf_weekly_pipeline_summary";
    const response = await fetch(`${baseUrl}/v1/sandbox/workflow-runs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflow_id: workflowId, input: { source: "natoros-cli" } }),
    });
    console.log(JSON.stringify(await response.json(), null, 2));
    return;
  }

  process.exitCode = 1;
  console.error("Unknown command. Run: natoros help");
}

main().catch((error) => {
  process.exitCode = 1;
  console.error(error.message);
});
