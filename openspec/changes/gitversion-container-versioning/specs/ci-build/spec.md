## MODIFIED Requirements

### Requirement: Build and push API Docker image
The CI pipeline SHALL build a Docker image for the ASP.NET Core API using a multi-stage Dockerfile and push it to the container registry tagged with both the semantic version (`fullSemVer`) and `latest`.

#### Scenario: Successful API image build
- **WHEN** a push to `main` triggers the workflow
- **THEN** the API image is built using the multi-stage Dockerfile at `src/Snake.Api/Dockerfile`
- **THEN** the image is tagged `<registry>/snake-api:<fullSemVer>` and `<registry>/snake-api:latest`
- **THEN** both tags are pushed to the registry

#### Scenario: Successful frontend image build
- **WHEN** a push to `main` triggers the workflow
- **THEN** the frontend image is built using the multi-stage Dockerfile at `src/App/Dockerfile`
- **THEN** the Angular app is compiled with `ng build --configuration production` inside the build stage
- **THEN** the resulting static files are served from an `nginx:alpine` runtime image
- **THEN** the image is tagged `<registry>/snake-frontend:<fullSemVer>` and `<registry>/snake-frontend:latest`
- **THEN** both tags are pushed to the registry

#### Scenario: Build jobs require full git clone
- **WHEN** the `build-api` or `build-frontend` job checks out the repository
- **THEN** `fetch-depth: 0` is set so that the git history is complete

### Requirement: Authenticate to GitHub Container Registry
The workflow SHALL authenticate to the container registry using the provided credentials before pushing images.

#### Scenario: Registry login succeeds
- **WHEN** the build job starts
- **THEN** `docker login` succeeds using the provided credentials
- **THEN** subsequent `docker push` commands succeed without authentication errors
