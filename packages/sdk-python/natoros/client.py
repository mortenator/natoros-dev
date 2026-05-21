import httpx


class NatorOSClient:
    def __init__(self, api_key=None, access_token=None, base_url="https://www.natoros.com/api"):
        self.api_key = api_key
        self.access_token = access_token
        self.base_url = base_url.rstrip("/")

    def request(self, path, method="GET", json=None, idempotency_key=None):
        headers = {"Accept": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        elif self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        if idempotency_key:
            headers["Idempotency-Key"] = idempotency_key
        response = httpx.request(method, f"{self.base_url}{path}", headers=headers, json=json, timeout=30)
        response.raise_for_status()
        return response.json()

    def list_agents(self):
        return self.request("/v1/agents")

    def list_workflows(self):
        return self.request("/v1/workflows")

    def list_workflow_runs(self):
        return self.request("/v1/workflow-runs")

    def list_tasks(self):
        return self.request("/v1/tasks")

    def list_records(self, object="tasks"):
        return self.request(f"/v1/records?object={object}")

    def create_workflow_run(self, workflow_id, input=None, idempotency_key=None):
        return self.request(
            "/v1/workflow-runs",
            method="POST",
            json={"workflow_id": workflow_id, "input": input or {}},
            idempotency_key=idempotency_key or f"py-{workflow_id}",
        )

    def create_task(self, title, idempotency_key=None, **fields):
        return self.request(
            "/v1/tasks",
            method="POST",
            json={"title": title, **fields},
            idempotency_key=idempotency_key or f"py-task-{title}",
        )

    def create_sandbox_workflow_run(self, workflow_id, input=None):
        return self.request(
            "/v1/sandbox/workflow-runs",
            method="POST",
            json={"workflow_id": workflow_id, "input": input or {}},
        )
