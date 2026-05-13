## Why

The multi-player Snake game needs a repeatable, automated path to production. Right now there is no CI/CD pipeline — every deployment is manual. Azure Container Apps is chosen because it supports scale-to-zero (cost-efficient for a hobby/demo workload), HTTP-triggered autoscaling, and managed ingress with TLS.

## What Changes

- New GitHub Actions workflow file (`.github/workflows/deploy.yml`) that builds and pushes both containers and then deploys them to Azure Container Apps.
- New Bicep IaC files (`infra/`) to provision a Container Apps Environment, the backend Container App (`snake-api`), and the frontend Container App (`snake-frontend`).
- Backend Container App configured with HTTP scaling rule, scale-to-zero enabled, max 1 replica, and minimal CPU/memory resources.
- Frontend Container App configured with at least 1 replica (static Angular app), minimal resources.
- GitHub repository secrets documented for the workflow (Azure credentials, registry credentials).

## Capabilities

### New Capabilities

- `ci-build`: Build Docker images for the Angular frontend and ASP.NET Core API, push to a container registry (GitHub Container Registry / Azure Container Registry).
- `cd-deploy`: Deploy both container images to Azure Container Apps using Bicep, triggered on push to `main`.
- `aca-backend-scaling`: Backend Container App scales to 0 when idle, scales up to 1 replica on HTTP traffic via an HTTP scaling rule.
- `aca-infra`: Bicep templates that provision the Container Apps Environment and both apps with minimal resource allocations.

### Modified Capabilities

## Impact

- New files: `.github/workflows/deploy.yml`, `infra/main.bicep`, `infra/main.bicepparam`, `Dockerfile` for API, `Dockerfile` for frontend (nginx-based).
- No changes to existing application source code.
- Requires Azure subscription + service principal secret in GitHub repo settings.
- Requires a container registry (GitHub Container Registry `ghcr.io` preferred — no extra cost).
