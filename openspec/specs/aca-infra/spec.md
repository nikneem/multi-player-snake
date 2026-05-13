## ADDED Requirements

### Requirement: Container Apps Environment provisioned by Bicep
Bicep SHALL create a Container Apps Environment (Consumption tier) in the target resource group to host both Container Apps.

#### Scenario: Environment created on first deployment
- **WHEN** Bicep is applied to an empty resource group
- **THEN** a Container Apps Environment resource is created with Consumption workload profile

### Requirement: Minimal CPU and memory for both apps
Both the `snake-api` and `snake-frontend` Container Apps SHALL be configured with the minimum viable resources: `cpu: 0.25` vCPU and `memory: 0.5Gi`.

#### Scenario: Resources meet ACA minimum
- **WHEN** both Container Apps are deployed
- **THEN** each Container App is allocated 0.25 vCPU and 0.5 Gi memory per replica
- **THEN** deployment succeeds without resource quota errors

### Requirement: Frontend Container App has external ingress
The `snake-frontend` Container App SHALL have external HTTP ingress enabled on port 80 so it is reachable from the public internet via its `*.azurecontainerapps.io` FQDN.

#### Scenario: Frontend is publicly accessible
- **WHEN** `snake-frontend` is deployed
- **THEN** it is accessible at its ACA-assigned FQDN over HTTPS

### Requirement: Backend Container App has internal ingress
The `snake-api` Container App SHALL have external HTTP ingress enabled on port 8080 (the ASP.NET Core default container port).

#### Scenario: API responds to HTTP requests
- **WHEN** `snake-api` is deployed and scaled up
- **THEN** it responds to HTTP requests on its ACA-assigned FQDN

### Requirement: Container registry credentials stored as ACA secrets
Both Container Apps SHALL reference a registry secret for `ghcr.io` so ACA can pull private images without embedding credentials in the Bicep template.

#### Scenario: Image pull succeeds with registry secret
- **WHEN** ACA starts a replica for either Container App
- **THEN** it pulls the image from `ghcr.io` using the stored registry secret
- **THEN** the container starts successfully

### Requirement: Frontend Container App receives backend URL via environment variable
The `snake-frontend` Container App SHALL have an `API_URL` environment variable set to the public FQDN of the `snake-api` Container App so the Angular runtime config (`env.js`) can be generated with the correct backend URL at container start.

#### Scenario: Frontend env.js generated with correct API URL
- **WHEN** the `snake-frontend` container starts
- **THEN** the Docker entrypoint runs `envsubst` on `env.template.js` using the `API_URL` env var
- **THEN** the resulting `env.js` exposes `window.__env.apiUrl` to the Angular app
- **THEN** Angular's `HealthService` calls `${apiUrl}/health` against the correct backend host

#### Scenario: API_URL sourced from Bicep output
- **WHEN** Bicep deploys both Container Apps
- **THEN** the `snake-api` FQDN output is referenced as the value for `API_URL` on the `snake-frontend` Container App
- **THEN** no hardcoded URL is embedded in the Bicep template
