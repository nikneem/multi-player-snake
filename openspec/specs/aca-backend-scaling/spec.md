## ADDED Requirements

### Requirement: Backend scales to zero when idle
The `snake-api` Container App SHALL be configured with `minReplicas: 0` so that it terminates all replicas when there is no HTTP traffic, eliminating idle compute cost.

#### Scenario: No traffic — scales to zero
- **WHEN** no HTTP requests have been received for the scale-down period
- **THEN** ACA reduces the replica count to 0
- **THEN** no compute charges are incurred for the backend

### Requirement: Backend scales up on HTTP traffic (HTTP scaling rule)
The `snake-api` Container App SHALL have an HTTP scaling rule so that ACA starts a replica when an HTTP request arrives while the app is at 0 replicas.

#### Scenario: First request triggers scale-up
- **WHEN** an HTTP request arrives and replica count is 0
- **THEN** ACA starts 1 replica via the HTTP scaling rule
- **THEN** the request is held until the replica is healthy, then served

#### Scenario: Scale does not exceed 1 replica
- **WHEN** concurrent HTTP requests arrive
- **THEN** ACA does NOT create more than 1 replica (`maxReplicas: 1`)

### Requirement: Backend maximum replica count is 1
The `snake-api` Container App SHALL be configured with `maxReplicas: 1` to prevent horizontal scaling beyond a single instance.

#### Scenario: High request volume stays at 1 replica
- **WHEN** many concurrent requests arrive at the backend
- **THEN** the replica count remains at 1 and does not exceed it
