from natoros import NatorOSClient

client = NatorOSClient()
run = client.create_sandbox_workflow_run("wf_weekly_pipeline_summary", {"company": "Atlas Labs"})
print(run)
