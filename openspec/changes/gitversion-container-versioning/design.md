## Context

The current CI/CD workflow (`deploy.yml`) tags every Docker image with the raw `github.sha`. While unique, SHA tags are opaque — there is no way to determine order, stability, or intent from the tag alone. GitHub releases are not created, so there is no versioned artefact manifest or changelog visible on the repository. GitVersion is a widely-used, deterministic SemVer calculator that derives a version from git history and branch/tag conventions without requiring manual version bumps.

The workflow already has a `build-api`, `build-frontend`, and `deploy` job structure that maps cleanly to adding an upstream `version` job and a downstream `release` job.

## Goals / Non-Goals

**Goals:**
- Derive a semantic version (`fullSemVer`) automatically from git history on every workflow run.
- Tag Docker images with the SemVer string instead of the git SHA.
- Create a GitHub release (with auto-generated notes) on every successful deployment from `main`.
- Keep all changes confined to the CI/CD workflow and a new `GitVersion.yml` config file — no application source changes.

**Non-Goals:**
- Updating `AssemblyInfo` or `.csproj` version properties in the .NET project (not needed for container workflows).
- Enforcing conventional commits (GitVersion's `ContinuousDelivery` mode works without them).
- Custom domain or CDN setup.
- Multi-environment promotion (dev/staging/prod) gating.

## Decisions

### 1. GitVersion mode: `ContinuousDelivery`

**Decision**: Use `ContinuousDelivery` mode in `GitVersion.yml`.

**Rationale**: Every push to `main` produces a releasable image. `ContinuousDelivery` increments the patch version on each commit after a tag and appends a pre-release label on non-main branches (e.g. `1.3.0-feature-foo.4`). This gives meaningful tags for both stable and in-progress builds.

**Alternative considered**: `Mainline` — auto-increments on every commit without needing tags. Rejected because it makes it harder to control major/minor bumps and removes the ability to set an explicit `next-version` baseline.

### 2. Cross-job version sharing: dedicated `version` job with `outputs`

**Decision**: Add a `version` job that runs first, exposes `fullSemVer` and `majorMinorPatch` as job outputs, and is listed in the `needs:` of all downstream jobs.

**Rationale**: GitVersion requires `fetch-depth: 0` (full clone). Isolating this into its own job avoids duplicating the setup/execute steps in every build job. Job outputs are the idiomatic GitHub Actions mechanism for passing computed values across jobs.

**Alternative considered**: Running GitVersion in each build job separately — rejected because it duplicates work and risks inconsistent versions if the job runners checkout at different points in time.

### 3. Image tag strategy: `<fullSemVer>` + `latest`

**Decision**: Push two tags per image: `<fullSemVer>` (e.g. `1.2.0` or `1.2.0-beta.3`) and `latest` (on `main` only).

**Rationale**: `fullSemVer` includes pre-release labels for non-main branches, making it safe to push from feature branches without polluting `latest`. The Bicep deployment always passes the explicit SemVer tag so the deployed version is always deterministic.

### 4. GitHub release creation: `gh release create`

**Decision**: Add a `release` job that runs after `deploy` (on `main` only) and calls `gh release create v<fullSemVer> --generate-notes`.

**Rationale**: The `gh` CLI is pre-installed on `ubuntu-latest` and GitHub's `--generate-notes` flag auto-generates release notes from PRs merged since the last release. No third-party action needed.

**Workflow permission required**: `contents: write` must be added to the workflow's `permissions` block.

### 5. `GitVersion.yml` at repository root

**Decision**: Place `GitVersion.yml` at the repository root (default lookup path for GitVersion).

**Rationale**: No `configFilePath` override needed in the action, keeping the workflow step simple. The config sets `next-version: 1.0.0` as the starting baseline and `mode: ContinuousDelivery`.

## Risks / Trade-offs

- **Full clone overhead** → `fetch-depth: 0` increases checkout time on large repos. For this repo the risk is negligible; can be mitigated with `--filter=tree:0` partial clones if needed in the future.
- **First-run tag baseline** → Without an existing git tag, GitVersion starts at `0.1.0`. Setting `next-version: 1.0.0` in `GitVersion.yml` ensures the first release is `1.0.0`. Teams must create an annotated tag (`v1.0.0`) after the first successful run to anchor history.
- **Duplicate release tags** → If the workflow re-runs on the same commit (e.g. via `workflow_dispatch`), `gh release create` will fail with "already exists". The `release` job should use `--notes-start-tag` and add `|| true` or a pre-check to be idempotent.
- **Non-main builds push images** → Feature branch images will have pre-release SemVer tags (e.g. `1.2.0-my-feature.3`) but will NOT push `latest` and will NOT trigger a release. This is correct behaviour.

## Migration Plan

1. Merge this change to `main`.
2. Immediately create an annotated git tag `v1.0.0` on the current `main` HEAD so GitVersion has a starting anchor.
3. The next push to `main` will produce version `1.0.1` (or as computed by GitVersion from history).
4. Old SHA-tagged images in the registry remain valid and can be cleaned up via ACR lifecycle policies at any time.

**Rollback**: Revert the workflow file. Old SHA-based images are still present in the registry; the Bicep parameter reverts to `github.sha` automatically.
