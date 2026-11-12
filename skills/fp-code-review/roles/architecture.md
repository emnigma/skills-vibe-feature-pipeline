# Architecture review

Find structural defects the change introduces: wrong dependencies between layers, logic in the
wrong layer, a port or adapter that leaks, new types or states the behaviour does not need, and
documented invariants the change breaks.

## Read first

- The rules file and the architecture guides the profile names (`architecture-guides`).
- The design documents of the modules the change touches.
- The spec of the change, to know which behaviour justifies each new type.

## What to look for

### Dependencies

- A dependency that points the wrong way: domain or application code that reaches a framework, UI,
  transport, storage or an external SDK directly instead of through a port.
- A new import across modules that the module layout does not allow.
- A cycle broken with a field assigned later instead of a port or an event stream.

### Placement

- Business decisions in a UI component, an adapter or a composition root.
- A composition root that does more than construct and connect: decisions, I/O, async work,
  user-visible text.
- A type placed in the module of its first caller instead of the module of its domain.

### New structure

- A new type, state, status value, layer or port with no criterion of the spec that needs it.
- A second model of a concept that already exists (a parallel status, a second registry, a copy of
  an existing flow). Find the existing one and compare.
- A state expressed as several booleans instead of one closed set of states.
- A failure passed across a boundary as a string or a raw exception instead of a typed failure.

### Invariants

- A documented invariant of a touched module (ordering, ownership, one instance per key, terminal
  states) that the change breaks or no longer guarantees.
- A design document that the change makes wrong and does not update.

## Boundaries

- Races and lifetimes: concurrency. Behaviour bugs: correctness. Written project rules that are not
  structural: project rules. Generated-code patterns: slop.
