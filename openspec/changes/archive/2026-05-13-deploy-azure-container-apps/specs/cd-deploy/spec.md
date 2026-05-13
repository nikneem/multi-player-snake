## ADDED Requirements

### Requirement: Deploy infrastructure with Bicep
The CD pipeline SHALL run `az deployment group create` with `infra/main.bicep` and `infra/main.bicepparam` to provision or update all Azure resources in an idempotent manner.

#### Scenario: First-time infrastructure provisioning
- **WHEN** the deploy job runs for the first time against an empty resource group
- **THEN** Bicep creates the Container Apps Environment, the `snake-api` Container App, and the `snake-frontend` Container App
- **THEN** the deployment completes without errors

#### Scenario: Subsequent deployment updates image tags
- **WHEN** the deploy job runs on a subsequent push with a new image SHA
- **THEN** Bicep updates both Container Apps to use the new image tags
- **THEN** ACA performs a rolling update with zero downtime

### Requirement: Authenticate to Azure via OIDC
The workflow SHALL authenticate to Azure using federated identity (OIDC) with `azure/login@v2` and the secrets `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID` — no long-lived client secret stored in GitHub.

#### Scenario: OIDC login succeeds
- **WHEN** the deploy job runs on a push to `main`
- **THEN** `azure/login` obtains an access token via OIDC
- **THEN** subsequent `az` CLI commands succeed with that token

### Requirement: Deploy only on push to main
The workflow SHALL only trigger on `push` events to the `main` branch and on `workflow_dispatch` for manual re-runs.

#### Scenario: Push to non-main branch does not deploy
- **WHEN** a commit is pushed to a branch other than `main`
- **THEN** the deploy workflow does NOT run

#### Scenario: Manual re-run deploys latest main
- **WHEN** the workflow is triggered manually via `workflow_dispatch`
- **THEN** the workflow runs with the current state of `main`
