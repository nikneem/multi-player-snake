## ADDED Requirements

### Requirement: Calculate semantic version from git history
The CI workflow SHALL include a dedicated `version` job that runs before all build jobs. It SHALL install GitVersion and execute it against the full git history to produce a semantic version string. The computed version SHALL be exposed as a job output (`fullSemVer` and `majorMinorPatch`) for consumption by downstream jobs.

#### Scenario: Version job runs before build jobs
- **WHEN** the workflow is triggered by a push or `workflow_dispatch`
- **THEN** the `version` job starts before `build-api` and `build-frontend`
- **THEN** both build jobs declare `needs: [version]`

#### Scenario: GitVersion calculates version on main
- **WHEN** the workflow runs on a push to `main` after a `v1.0.0` anchor tag exists
- **THEN** `gittools/actions/gitversion/execute` outputs a `fullSemVer` such as `1.0.1`
- **THEN** the value is available as `needs.version.outputs.fullSemVer` in downstream jobs

#### Scenario: GitVersion calculates pre-release version on feature branch
- **WHEN** the workflow runs on a push to a branch other than `main`
- **THEN** `fullSemVer` contains a pre-release label (e.g. `1.0.1-feature-foo.3`)

#### Scenario: Full clone is required
- **WHEN** the `version` job checks out the repository
- **THEN** `fetch-depth: 0` is set on `actions/checkout` so GitVersion can walk the full commit graph

### Requirement: Tag Docker images with semantic version
The build jobs SHALL tag each Docker image with the `fullSemVer` computed by the `version` job in addition to `latest`.

#### Scenario: Image tagged with SemVer on main
- **WHEN** `build-api` or `build-frontend` runs on a push to `main`
- **THEN** the image is pushed with the tag `<registry>/snake-api:<fullSemVer>` (e.g. `1.0.1`)
- **THEN** the image is also pushed with the `latest` tag

#### Scenario: Image tagged with pre-release SemVer on feature branch
- **WHEN** `build-api` or `build-frontend` runs on a non-main branch
- **THEN** the image is pushed with the tag `<registry>/snake-api:<fullSemVer>` including pre-release label
- **THEN** the `latest` tag is NOT updated

### Requirement: GitVersion.yml config file at repository root
A `GitVersion.yml` file SHALL exist at the repository root to configure versioning mode, starting version, and branch policies.

#### Scenario: GitVersion reads config automatically
- **WHEN** `gittools/actions/gitversion/execute` runs without an explicit `configFilePath`
- **THEN** it reads `GitVersion.yml` from the repository root
- **THEN** versioning mode is `ContinuousDelivery` with `next-version: 1.0.0`
