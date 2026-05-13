## 1. Dockerfiles

- [x] 1.1 Create `src/Snake.Api/Dockerfile` — multi-stage: `mcr.microsoft.com/dotnet/sdk:10.0` build stage, `mcr.microsoft.com/dotnet/aspnet:10.0` runtime stage; expose port 8080
- [x] 1.2 Create `src/App/Dockerfile` — multi-stage: `node:22-alpine` build stage runs `ng build --configuration production`; `nginx:alpine` runtime stage copies `dist/` to `/usr/share/nginx/html`
- [x] 1.3 Add `src/App/nginx.conf` with a minimal nginx config that handles Angular's HTML5 routing (try_files fallback to `index.html`)
- [x] 1.4 Add Docker entrypoint script to `snake-frontend` image: run `envsubst < env.template.js > /usr/share/nginx/html/env.js` before starting nginx, so `API_URL` env var is injected at container start

## 2. Bicep Infrastructure

- [x] 2.1 Create `infra/main.bicep` — declare parameters: `location`, `environmentName`, `apiImageTag`, `frontendImageTag`, `registryHost`, `registryUsername`, `registryPassword` (secure string)
- [x] 2.2 Add a `Microsoft.App/managedEnvironments` resource (Consumption tier) to `infra/main.bicep`
- [x] 2.3 Add `snake-api` Container App resource: external ingress on port 8080, `cpu: '0.25'`, `memory: '0.5Gi'`, `minReplicas: 0`, `maxReplicas: 1`, HTTP scaling rule, registry secret
- [x] 2.4 Add `snake-frontend` Container App resource: external ingress on port 80, `cpu: '0.25'`, `memory: '0.5Gi'`, `minReplicas: 1`, `maxReplicas: 1`, registry secret
- [x] 2.5 Add `outputs` to `infra/main.bicep` for `apiUrl` and `frontendUrl` (the ACA-assigned FQDNs)
- [x] 2.6 Set `API_URL` env var on `snake-frontend` Container App using the `snake-api` FQDN output from Bicep (no hardcoded URL)
- [x] 2.7 Create `infra/main.bicepparam` with placeholder parameter values and comments documenting required secrets

## 3. GitHub Actions Workflow

- [x] 3.1 Create `.github/workflows/deploy.yml` with triggers: `push` to `main` and `workflow_dispatch`
- [x] 3.2 Add `build-api` job: checkout, log in to registry with `REGISTRY_*` secrets, build and push `snake-api` image tagged with `${{ github.sha }}` and `latest`
- [x] 3.3 Add `build-frontend` job: checkout, log in to registry, build and push `snake-frontend` image tagged with `${{ github.sha }}` and `latest`
- [x] 3.4 Add `deploy` job (depends on both build jobs): `azure/login@v2` with OIDC using `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID` secrets; run `az deployment group create` passing the Bicep file and image tag parameters

## 4. Documentation

- [x] 4.1 Add a `## Deployment` section to `README.md` (or create one) documenting: required GitHub secrets, one-time Azure setup commands (resource group + service principal + federated credential), and the registry credential requirements
