## ADDED Requirements

### Requirement: Create GitHub release on successful deployment
The workflow SHALL include a `release` job that runs after a successful `deploy` job on the `main` branch and creates a GitHub release tagged `v<fullSemVer>` with auto-generated release notes.

#### Scenario: Release created after successful main deployment
- **WHEN** the `deploy` job completes successfully on a push to `main`
- **THEN** the `release` job runs
- **THEN** `gh release create v<fullSemVer>` is executed with `--generate-notes`
- **THEN** the release appears on the GitHub repository's Releases page tagged `v<fullSemVer>`

#### Scenario: Release is not created on non-main branches
- **WHEN** the workflow runs on a branch other than `main`
- **THEN** the `release` job does NOT run

#### Scenario: Duplicate release tag is handled gracefully
- **WHEN** the workflow is re-triggered on the same commit (e.g. via `workflow_dispatch`)
- **THEN** if a release for `v<fullSemVer>` already exists, the job exits successfully without error

### Requirement: Workflow has write permission for release creation
The workflow permissions block SHALL include `contents: write` so the `gh` CLI can create tags and releases.

#### Scenario: Release job has required permissions
- **WHEN** the `release` job runs
- **THEN** the `GITHUB_TOKEN` has `contents: write` scope
- **THEN** `gh release create` succeeds without a 403 error
