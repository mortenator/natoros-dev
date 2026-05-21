import httpx


class NatorOSClient:
    def __init__(self, api_key=None, access_token=None, base_url="https://www.natoros.com/api"):
        self.api_key = api_key
        self.access_token = access_token
        self.base_url = base_url.rstrip("/")

    def request(self, path, method="GET", json=None, idempotency_key=None):
        headers = {"Accept": "application/json"}
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        if self.api_key:
            headers["X-API-Key"] = self.api_key
        if idempotency_key:
            headers["Idempotency-Key"] = idempotency_key
        response = httpx.request(method, f"{self.base_url}{path}", headers=headers, json=json, timeout=30)
        response.raise_for_status()
        return response.json()

    def list_agents(self):
        return self.request("/v1/agents")

    def list_workflows(self):
        return self.request("/v1/workflows")

    def create_sandbox_workflow_run(self, workflow_id, input=None):
        return self.request(
            "/v1/sandbox/workflow-runs",
            method="POST",
            json={"workflow_id": workflow_id, "input": input or {}},
        )
