const DEFAULT_BASE_URL = "https://www.natoros.com/api";

export class NatorOSClient {
  constructor({ apiKey, accessToken, baseUrl = DEFAULT_BASE_URL } = {}) {
    this.apiKey = apiKey;
    this.accessToken = accessToken;
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async request(path, { method = "GET", body, idempotencyKey } = {}) {
    const headers = { Accept: "application/json" };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (this.apiKey) headers.Authorization = `Bearer ${this.apiKey}`;
    else if (this.accessToken) headers.Authorization = `Bearer ${this.accessToken}`;
    if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data?.error?.message || `NatorOS request failed with ${response.status}`);
      error.response = response;
      error.data = data;
      throw error;
    }
    return data;
  }

  listAgents() {
    return this.request("/v1/agents");
  }

  listWorkflows() {
    return this.request("/v1/workflows");
  }

  listWorkflowRuns() {
    return this.request("/v1/workflow-runs");
  }

  listTasks() {
    return this.request("/v1/tasks");
  }

  listRecords(object = "tasks") {
    return this.request(`/v1/records?object=${encodeURIComponent(object)}`);
  }

  createWorkflowRun(workflowId, input = {}, { idempotencyKey = crypto.randomUUID() } = {}) {
    return this.request("/v1/workflow-runs", {
      method: "POST",
      body: { workflow_id: workflowId, input },
      idempotencyKey,
    });
  }

  createTask(title, fields = {}, { idempotencyKey = crypto.randomUUID() } = {}) {
    return this.request("/v1/tasks", {
      method: "POST",
      body: { title, ...fields },
      idempotencyKey,
    });
  }

  updateTask(id, fields = {}, { idempotencyKey = crypto.randomUUID() } = {}) {
    return this.request("/v1/tasks", {
      method: "PATCH",
      body: { id, ...fields },
      idempotencyKey,
    });
  }

  createSandboxWorkflowRun(workflowId, input = {}) {
    return this.request("/v1/sandbox/workflow-runs", {
      method: "POST",
      body: { workflow_id: workflowId, input },
    });
  }
}

export const natoros = (options) => new NatorOSClient(options);
