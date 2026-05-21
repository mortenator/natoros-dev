import { NatorOSClient } from "../../packages/sdk-js/src/index.js";

const client = new NatorOSClient();
const run = await client.createSandboxWorkflowRun("wf_weekly_pipeline_summary", {
  company: "Atlas Labs",
});
console.log(run);
