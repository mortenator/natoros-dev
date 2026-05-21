# @natoros/sdk

JavaScript SDK for NatorOS, the agentic OS and AI OS for governed enterprise AI workers.

```js
import { NatorOSClient } from "@natoros/sdk";

const client = new NatorOSClient();
const run = await client.createSandboxWorkflowRun("wf_weekly_pipeline_summary", {
  company: "Atlas Labs",
});
console.log(run.status);
```
