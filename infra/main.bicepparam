using './main.bicep'

// Azure region — override if deploying outside westeurope
param location = 'westeurope'

// Logical name prefix for the Container Apps Environment
param environmentName = 'snake-game'

// Image tags — set by the GitHub Actions workflow using the Git SHA
// Example: param apiImageTag = 'abc1234'
param apiImageTag = 'latest'
param frontendImageTag = 'latest'

// Container registry — stored as GitHub Actions secrets:
//   REGISTRY_HOST     e.g. myregistry.azurecr.io
//   REGISTRY_USERNAME e.g. myregistry
//   REGISTRY_PASSWORD (admin password or token)
param registryHost = ''
param registryUsername = ''
param registryPassword = ''
