# Correctness review

Find behaviour defects the change introduces or reaches: wrong results, broken callers, lost
behaviour, and missing tests for behaviour a reviewer must trust. This role also covers the
maintainability defects that turn into bugs on the next change.

## Read first

- The project's rules file and module map, to know which module owns what.
- The README or design document of each changed module, for its contracts.
- The spec in `PACKET.md`, if the change implements one.

## What to look for

### Changed lines

Read every changed line and ask: with which input or state does this break?

- **Missing `else`.** For each new branch, what happens when it is not taken? A silent fallthrough
  over a closed set of states or failures is a common quiet bug.
- **Silent early return.** When is the value missing, and does returning hide a state bug instead
  of handling it?
- **State at every exit.** State set in a `try` body and not reset on failure. A loading status
  that is never left on error or cancellation.
- **Silent failure on results.** A non-zero exit code, a missing file, a discarded result, a
  failure mapped to success.
- **Order of operations.** Emit, persist or record after the state transition commits, never while
  it can still fail.
- **Language traps.** Value types with mutable members, equality that ignores a field, forced
  unwraps of values that can be missing, taking the first element of a list that can be empty,
  integer overflow in sizes and offsets.

### Removed behaviour

Read the removed lines as carefully as the added ones. Which guard, check, error mapping, cleanup,
event or test did the change remove, and where is it restored? A refactor that moves code often
drops a guard the old call site had.

### Callers and callees

- Find every caller of each changed signature, default value or contract, including other modules,
  test fixtures and fakes. Does each one still hold?
- A new case of a closed type: does every exhaustive branch handle it correctly, not just compile?
- A behaviour change in a core module: do its readers still read it the same way?

### Persistence compatibility

- A renamed, removed or retyped field of a persisted or transmitted record breaks existing data or
  the other side, unless the change adds a version bump and a migration with a test.

### Symmetry and naming

- Find the sibling code that solves the same problem. A new branch must handle what its sibling
  handles. Divergence from the sibling is usually the bug.
- Keys normalised on insert must be normalised the same way on lookup.
- A name that promises less or more than the code does.
- A document that the change makes wrong.

### Tests

- A bug fix without a test that fails without the fix.
- A test that misses the behaviour it claims to cover.
- A new behaviour a reviewer must trust with no test at its owning level.

## Boundaries

- Layering and dependencies: architecture. Races, cancellation and lifetimes: concurrency.
  Exploitable input: security. Written project rules: project rules. Generated-code patterns,
  comments, duplication and tests that assert nothing: slop. Report a behaviour defect here even
  when it also breaks a rule; leave the rule to its role.
