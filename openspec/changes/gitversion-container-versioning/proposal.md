## Why

Container images are currently tagged with `github.sha` (a 40-character commit hash), making it impossible to tell which version is running in production without cross-referencing git history. There are also no GitHub releases, so there is no auditable changelog or versioned artifact manifest. Introducing GitVersion-based semantic versioning gives every image a human-readable version number derived from git history and tags, and makes releases a first-class artefact.

## What Changes

- Add a dedicated `version` job to the workflow that runs before all build jobs, installs GitVersion, and exports the calculated `fullSemVer` and `majorMinorPatch` as job outputs.
- Add a `GitVersion.yml` configuration file at the repo root to configure the versioning mode (`ContinuousDelivery`) and branch policies.
- **BREAKING** Replace `github.sha` image tags with `<fullSemVer>` (e.g. `1.2.0`, `1.2.0-beta.3`). Both the versioned tag and `latest` are still pushed.
- Add a `release` job that runs after a successful deploy on `main` and creates a GitHub release (tag + release notes) using the calculated version.
- Update `infra/main.bicep` parameter passing in the workflow to use the SemVer tag instead of the SHA tag.
- The workflow `fetch-depth` must be changed to `0` (full clone) to allow GitVersion to walk git history.

## Capabilities

### New Capabilities

- `container-versioning`: GitVersion setup, execution, and SemVer-based Docker image tagging in the CI/CD workflow.
- `github-releases`: Automatic GitHub release creation (tag + release notes) on every successful main-branch deployment.

### Modified Capabilities

- `ci-build`: Image tags change from `<git-sha>` to `<fullSemVer>` — **BREAKING** change in tag format. `fetch-depth: 0` becomes a requirement.
- `cd-deploy`: Bicep deployment receives the SemVer tag instead of the SHA tag.

## Impact

- `.github/workflows/deploy.yml` — new `version` job, updated image tags, new `release` job, `fetch-depth: 0` on all checkouts.
- `GitVersion.yml` — new file at repository root.
- `infra/main.bicep` and workflow parameter passing — tag parameter changes from SHA to SemVer.
- `gh` CLI (already available on `ubuntu-latest`) used for release creation; requires `contents: write` permission added to the workflow.
- No application code changes required.
