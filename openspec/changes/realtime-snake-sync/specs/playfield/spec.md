## ADDED Requirements

### Requirement: PlayfieldComponent injects RealtimeService
`PlayfieldComponent` SHALL inject `RealtimeService` using `inject()` and expose a computed signal `remoteSegmentIndices` that flattens all remote snake segments across all connected players into a `Set<number>` of flat cell indices.

#### Scenario: Remote segment indices computed correctly
- **WHEN** two remote players are connected with 5 segments each
- **THEN** `remoteSegmentIndices` contains at most 10 distinct flat indices (fewer if segments overlap)
