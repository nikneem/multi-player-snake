## Context

The repo is a multi-player Snake game consisting of:
- **Frontend**: Angular 21 SPA built with `ng build` → static files served by nginx.
- **Backend**: ASP.NET Core 10 minimal API.
- **Orchestration**: .NET Aspire (local dev only — not used in production).

There is currently no CI/CD pipeline and no IaC. The target platform is **Azure Container Apps (ACA)** — a serverless container platform with built-in HTTP ingress, TLS, and KEDA-based autoscaling.

## Goals / Non-Goals

**Goals:**
- Fully automated build-and-deploy on push to `main` via GitHub Actions.
- Both services deployed as Azure Container Apps in the same Container Apps Environment.
- Backend scales to 0 replicas when idle; scales up to 1 replica on incoming HTTP traffic.
- Frontend keeps at least 1 replica (static files; effectively zero cost anyway).
- Minimal CPU (0.25 vCPU) and memory (0.5 Gi) for both apps.
- Infrastructure provisioned via Bicep (idempotent; no manual Azure Portal steps).
- Images stored in GitHub Container Registry (`ghcr.io`) — no extra Azure registry cost.

**Non-Goals:**
- Multi-region or high-availability setup.
- Staging / preview environments.
- Custom domain or managed certificate (ingress uses the default `*.azurecontainerapps.io` FQDN).
- Database or persistent storage.
- Monitoring / alerting beyond what ACA provides out of the box.

## Decisions

### D1 — Container Registry: GitHub Container Registry (`ghcr.io`)
`ghcr.io` is free for public repos and requires no extra Azure resources. Images are tagged with the Git SHA and also tagged `latest`. ACA pulls from `ghcr.io` using a registry credential secret.

*Alternative considered*: Azure Container Registry — adds cost and another resource to manage.

### D2 — IaC: Bicep (not Terraform or ARM JSON)
The repo already uses .NET tooling; Bicep integrates naturally and is the Microsoft-recommended IaC language for Azure. A single `infra/main.bicep` with an accompanying `infra/main.bicepparam` keeps it simple.

*Alternative considered*: Pulumi / Terraform — adds language/tool dependency not otherwise present.

### D3 — Backend scaling: HTTP rule, min 0, max 1
The game is a demo/hobby project. Scale-to-zero eliminates idle compute cost entirely. Max 1 replica avoids the complexity (and cost) of distributed session state. The KEDA HTTP scaler built into ACA triggers a replica on first request; cold-start for .NET 10 on a minimal image is acceptable (~2–4 s).

### D4 — Frontend: min 1, max 1 replica
The Angular app is a static nginx container. Serving static files has negligible CPU cost. Keeping 1 replica means no cold-start for the frontend; the backend cold-start is the only latency concern.

### D5 — Workflow trigger: push to `main`
Simple and predictable. A single deploy job builds both images in parallel steps, then runs `az deployment group create` with the Bicep template.

### D6 — GitHub Actions auth to Azure: federated identity (OIDC)
`azure/login` with `client-id`/`tenant-id`/`subscription-id` via OIDC — no long-lived secret needed. Requires a federated credential on the service principal scoped to the `main` branch.

*Alternative considered*: `AZURE_CREDENTIALS` JSON secret — simpler to set up but stores a long-lived secret.

### D7 — Dockerfile strategy
- **API**: `mcr.microsoft.com/dotnet/aspnet:10.0` runtime image; multi-stage build from `mcr.microsoft.com/dotnet/sdk:10.0`.
- **Frontend**: multi-stage — `node:22-alpine` to run `ng build`, then `nginx:alpine` to serve `dist/`.

## Risks / Trade-offs

- **Cold start latency** → Mitigation: .NET 10 startup is fast; acceptable for demo workload. Add a `/healthz` probe so ACA reports healthy quickly.
- **OIDC federated credential setup** → Mitigation: README documents the one-time Azure CLI commands to create the service principal and federated credential. If user prefers client secret, the workflow can fall back to `AZURE_CREDENTIALS`.
- **Single replica backend** → Mitigation: Fine for demo; document that `max: 1` must be raised before multi-player production use.
- **ghcr.io pull authentication** → Mitigation: Store `GHCR_TOKEN` as a GitHub Actions secret; pass as ACA registry secret in Bicep.

## Migration Plan

1. Create Azure Resource Group manually (one-time).
2. Create service principal + federated credential (one-time, documented in README).
3. Add GitHub secrets: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_RG`, `GHCR_TOKEN`.
4. Push to `main` — workflow runs, Bicep provisions infra, images are built and deployed.
5. Rollback: re-run workflow on previous commit SHA (images are tagged by SHA).

## Open Questions

- None — all decisions above are self-contained for the scope of this change.
