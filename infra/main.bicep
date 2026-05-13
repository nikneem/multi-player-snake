@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Name prefix for the Container Apps Environment and apps')
param environmentName string = 'snake-game'

@description('Image tag for the snake-api container image')
param apiImageTag string

@description('Image tag for the snake-frontend container image')
param frontendImageTag string

@description('Container registry hostname (e.g. myregistry.azurecr.io)')
param registryHost string

@description('Container registry username')
param registryUsername string

@description('Container registry password')
@secure()
param registryPassword string

// ── Container Apps Environment (Consumption tier) ─────────────────────────────

resource env 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${environmentName}-env'
  location: location
  properties: {
    workloadProfiles: [
      {
        name: 'Consumption'
        workloadProfileType: 'Consumption'
      }
    ]
  }
}

// ── snake-api Container App ────────────────────────────────────────────────────

resource api 'Microsoft.App/containerApps@2024-03-01' = {
  name: 'snake-api'
  location: location
  properties: {
    managedEnvironmentId: env.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
        transport: 'http'
      }
      registries: [
        {
          server: registryHost
          username: registryUsername
          passwordSecretRef: 'registry-password'
        }
      ]
      secrets: [
        {
          name: 'registry-password'
          value: registryPassword
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'snake-api'
          image: '${registryHost}/snake-api:${apiImageTag}'
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 1
        rules: [
          {
            name: 'http-scaler'
            http: {
              metadata: {
                concurrentRequests: '10'
              }
            }
          }
        ]
      }
    }
  }
}

// ── snake-frontend Container App ──────────────────────────────────────────────

resource frontend 'Microsoft.App/containerApps@2024-03-01' = {
  name: 'snake-frontend'
  location: location
  properties: {
    managedEnvironmentId: env.id
    configuration: {
      ingress: {
        external: true
        targetPort: 80
        transport: 'http'
      }
      registries: [
        {
          server: registryHost
          username: registryUsername
          passwordSecretRef: 'registry-password'
        }
      ]
      secrets: [
        {
          name: 'registry-password'
          value: registryPassword
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'snake-frontend'
          image: '${registryHost}/snake-frontend:${frontendImageTag}'
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'API_URL'
              value: 'https://${api.properties.configuration.ingress.fqdn}'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}

// ── Outputs ───────────────────────────────────────────────────────────────────

output apiUrl string = 'https://${api.properties.configuration.ingress.fqdn}'
output frontendUrl string = 'https://${frontend.properties.configuration.ingress.fqdn}'
