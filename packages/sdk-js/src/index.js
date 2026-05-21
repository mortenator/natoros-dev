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
    if (this.accessToken) headers.Authorization = `Bearer ${this.accessToken}`;
    if (this.apiKey) headers["X-API-Key"] = this.apiKey;
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

  createSandboxWorkflowRun(workflowId, input = {}) {
    return this.request("/v1/sandbox/workflow-runs", {
      method: "POST",
      body: { workflow_id: workflowId, input },
    });
  }
}

export const natoros = (options) => new NatorOSClient(options);
