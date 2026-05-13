## ADDED Requirements

### Requirement: Build and push API Docker image
The CI pipeline SHALL build a Docker image for the ASP.NET Core API using a multi-stage Dockerfile and push it to GitHub Container Registry (`ghcr.io`) tagged with both the Git SHA and `latest`.

#### Scenario: Successful API image build
- **WHEN** a push to `main` triggers the workflow
- **THEN** the API image is built using the multi-stage Dockerfile at `src/Snake.Api/Dockerfile`
- **THEN** the image is tagged `ghcr.io/<owner>/<repo>/snake-api:<sha>` and `ghcr.io/<owner>/<repo>/snake-api:latest`
- **THEN** both tags are pushed to `ghcr.io`

#### Scenario: Successful frontend image build
- **WHEN** a push to `main` triggers the workflow
- **THEN** the frontend image is built using the multi-stage Dockerfile at `src/App/Dockerfile`
- **THEN** the Angular app is compiled with `ng build --configuration production` inside the build stage
- **THEN** the resulting static files are served from an `nginx:alpine` runtime image
- **THEN** the image is tagged `ghcr.io/<owner>/<repo>/snake-frontend:<sha>` and `ghcr.io/<owner>/<repo>/snake-frontend:latest`
- **THEN** both tags are pushed to `ghcr.io`

### Requirement: Authenticate to GitHub Container Registry
The workflow SHALL authenticate to `ghcr.io` using the built-in `GITHUB_TOKEN` (or a PAT stored as `GHCR_TOKEN`) before pushing images.

#### Scenario: Registry login succeeds
- **WHEN** the build job starts
- **THEN** `docker login ghcr.io` succeeds using the provided token
- **THEN** subsequent `docker push` commands succeed without authentication errors
