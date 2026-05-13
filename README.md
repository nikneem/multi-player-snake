# Multi-Player Snake

A multi-player Snake game built with Angular 21 (frontend) and ASP.NET Core 10 (backend), orchestrated locally with .NET Aspire.

## Local Development

### Prerequisites

- Node.js 22+, npm
- .NET 10 SDK
- .NET Aspire workload (`dotnet workload install aspire`)

### Run with Aspire (recommended)

```bash
dotnet run --project src/Aspire/Snake.Aspire.AppHost
```

This starts both the frontend (Angular dev server) and the backend API, wires service discovery, and opens the Aspire dashboard.

### Run frontend only

```bash
cd src/App
npm install
npm start
```

### Run backend only

```bash
dotnet run --project src/Snake.Api
```

---

## Deployment

The project deploys to **Azure Container Apps** via GitHub Actions on every push to `main`.

### Architecture

| Resource | Description |
|---|---|
| Container Apps Environment | Shared environment (Consumption tier) |
| `snake-api` | ASP.NET Core 10 API — min 0 / max 1 replica, HTTP scale rule |
| `snake-frontend` | Angular SPA on nginx — min 1 / max 1 replica |

### Required GitHub Secrets

Add these secrets in your repository settings (**Settings → Secrets and variables → Actions**):

| Secret | Description |
|---|---|
| `REGISTRY_HOST` | Container registry hostname, e.g. `myregistry.azurecr.io` |
| `REGISTRY_USERNAME` | Registry username / service principal ID |
| `REGISTRY_PASSWORD` | Registry password / service principal secret |
| `AZURE_CLIENT_ID` | Azure service principal (app) client ID for OIDC login |
| `AZURE_TENANT_ID` | Azure tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |
| `AZURE_RG` | Target resource group name |

### One-time Azure Setup

```bash
# 1. Create a resource group
az group create --name snake-game-rg --location westeurope

# 2. Create a service principal for GitHub Actions
az ad app create --display-name "snake-game-github-actions"
APP_ID=$(az ad app list --display-name "snake-game-github-actions" --query "[0].appId" -o tsv)
az ad sp create --id $APP_ID
SP_ID=$(az ad sp show --id $APP_ID --query id -o tsv)

# 3. Grant Contributor on the resource group
az role assignment create \
  --assignee $SP_ID \
  --role Contributor \
  --scope $(az group show --name snake-game-rg --query id -o tsv)

# 4. Add a federated credential for the main branch
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:<YOUR_GITHUB_ORG>/<YOUR_REPO>:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

After the service principal is created, set `AZURE_CLIENT_ID` to `$APP_ID` and `AZURE_TENANT_ID` / `AZURE_SUBSCRIPTION_ID` to your tenant and subscription IDs.

### Deploy

Push to `main` — the workflow runs automatically and:
1. Builds and pushes both Docker images tagged with the Git SHA
2. Runs `az deployment group create` with `infra/main.bicep` to provision/update all resources
3. Sets `API_URL` on the frontend container to the backend's ACA FQDN

To redeploy a previous version: re-run the workflow on the desired commit from the GitHub Actions UI.
