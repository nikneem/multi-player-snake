using './main.bicep'

// Azure region — override if deploying outside westeurope
param location = 'northeurope'

// Logical name prefix for the Container Apps Environment
param environmentName = 'snake-game'

// Image tags — set by the GitHub Actions workflow using the Git SHA
// Example: param apiImageTag = 'abc1234'
param apiImageTag = 'latest'
param frontendImageTag = 'latest'

// Container registry — stored as GitHub Actions secrets:
//   ACR_LOGIN_SERVER     e.g. myregistry.azurecr.io
//   ACR_LOGIN_USERNAME e.g. myregistry
//   ACR_LOGIN_PASSWORD (admin password or token)
param registryHost = ''
param registryUsername = ''
param registryPassword = ''
