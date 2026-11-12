# Slop review

Find the patterns of machine-generated code: crutches bolted onto existing code, overengineered new
types, slop comments, fake defensiveness and duplication. Code that looks deliberate can still be
nonsense; do not take apparent care as evidence of thought.

## Read first

- The comment rules of the project's rules file. If it has none: a comment is kept only for a
  contract, a reason the code cannot express, or a workaround.

## What to look for

Split the change into modified files and added files. Apply "Crutches" to the first list,
"Overengineering" to the second, and the rest to both. When you find one pattern, scan the rest of
the file and its siblings in the change.

### Crutches in existing code

- **A new parameter** passed only to reach deeper code, or not relevant to this method.
- **A new branch** on a mode or type flag deep inside a shared method. The decision belongs to the
  caller or a strategy.
- **A new method** that landed in this class because the file was open, not because it fits.
- **New state**: a nullable field or mutable variable that encodes a hidden state machine; a
  variable reassigned from several paths; a state holder nobody reads.
- **A default argument** added so that one caller compiles.

### Overengineering of new types

- A class whose logic does not deserve a class. A long compound name is evidence.
- A parallel hierarchy for a concept that already exists.
- An interface, generic or factory with one implementation and one caller, and no boundary role.
- A wrapper that adds no behaviour.
- A class that exists only to make a test easier, where a different test removes the need.

### Comments

- A comment that restates the code, narrates steps, cites a review, issue or spec section, quotes a
  user-visible string, or only makes sense inside this change.

### Fake production dressing

- Logging with no reader, or log-and-continue that hides a failure.
- Validation of impossible states: a branch for a case the types exclude, a null check on a value
  that cannot be null, a `try`/`catch` around code that cannot throw.

The author either shows that the guarded case is reachable, or deletes the guard. Real checks at a
trust boundary are not slop.

### Repetition and dead weight

- **Duplication**: near-identical blocks in several files of the change, or two copies of a rule
  or constant. Duplicated logic that can diverge silently is the most serious finding here.
- **Leftovers**: unused parameters, fields, functions, imports, test tags, constants, strings.
  Confirm with a usage search. After a cut, look for what only the cut code used.
- **Speculative API**: public functions, overloads or options added for later, with no caller.
- **Test slop**: tests that re-implement the code, assert nothing, repeat the same case, or test
  internal states instead of behaviour.

## Boundaries

- A pure rename or move, config, docs, CI or generated-only diff, or a trivial fix: report nothing
  and say so in the status line.
- A behaviour defect or a missing regression test: correctness. A written project rule: project
  rules. Wrong layering: architecture. Missing validation of untrusted input: security.
