## 1. GitVersion Configuration

- [x] 1.1 Create `GitVersion.yml` at the repository root with `mode: ContinuousDelivery` and `next-version: 1.0.0`
- [x] 1.2 Verify GitVersion.yml is not listed in `.gitignore`

## 2. Workflow: Version Job

- [x] 2.1 Add `contents: write` to the workflow-level `permissions` block (needed for release creation)
- [x] 2.2 Add a `version` job before `build-api` and `build-frontend` that checks out with `fetch-depth: 0`
- [x] 2.3 Add `gittools/actions/gitversion/setup@v4` step to install GitVersion `6.7.x`
- [x] 2.4 Add `gittools/actions/gitversion/execute@v4` step with `id: version_step`
- [x] 2.5 Expose `fullSemVer` and `majorMinorPatch` as job-level `outputs` mapped from `steps.version_step.outputs`

## 3. Workflow: Update Build Jobs

- [x] 3.1 Add `needs: [version]` to both `build-api` and `build-frontend` jobs
- [x] 3.2 Add `fetch-depth: 0` to the `actions/checkout` step in both build jobs
- [x] 3.3 Replace the `github.sha` image tag with `needs.version.outputs.fullSemVer` in `build-api`
- [x] 3.4 Replace the `github.sha` image tag with `needs.version.outputs.fullSemVer` in `build-frontend`

## 4. Workflow: Update Deploy Job

- [x] 4.1 Add `version` to the `needs:` list of the `deploy` job (alongside `build-api` and `build-frontend`)
- [x] 4.2 Replace the `apiImageTag=${{ github.sha }}` parameter with `apiImageTag=${{ needs.version.outputs.fullSemVer }}`
- [x] 4.3 Replace the `frontendImageTag=${{ github.sha }}` parameter with `frontendImageTag=${{ needs.version.outputs.fullSemVer }}`

## 5. Workflow: Release Job

- [x] 5.1 Add a `release` job that runs `needs: [deploy]` and only on `github.ref == 'refs/heads/main'`
- [x] 5.2 Add `actions/checkout@v6` step with `fetch-depth: 0` in the `release` job
- [x] 5.3 Add a step that runs `gh release create v${{ needs.version.outputs.fullSemVer }} --generate-notes --title "v${{ needs.version.outputs.fullSemVer }}"` (skip if tag already exists)
- [x] 5.4 Pass `fullSemVer` output from the `version` job to the `release` job via `needs.version.outputs.fullSemVer`

## 6. Verification

- [x] 6.1 Create an annotated git tag `v1.0.0` on the current `main` HEAD to provide GitVersion's starting anchor
- [ ] 6.2 Trigger the workflow via `workflow_dispatch` and verify the `version` job outputs a valid SemVer string
- [ ] 6.3 Confirm Docker images appear in the registry tagged with the SemVer string
- [ ] 6.4 Confirm a GitHub release is created at `v<semver>` with auto-generated notes
