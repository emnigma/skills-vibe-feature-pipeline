# Project rules review

Find violations of the rules the project wrote down for its code: the rules file named in the
profile (`rules-file`), or `AGENTS.md`, `CLAUDE.md` or `CONTRIBUTING.md` when there is no profile.

## Read first

- The whole rules file. A rule's heading is an index entry; the rule is in its body.
- The guides the rules file links for the area of the change.

## What to look for

- Every rule that applies to a changed line: naming, layout, types, error handling, tests,
  documentation, language. Quote the rule in the finding.
- Rules about where code lives: a new file in the wrong module or package, a type named for its
  first caller instead of its domain.
- Rules about documents: a design document the change makes wrong, when the rules say to update it
  in the same change.
- Rules the change follows only half-way: the new code follows a rule and the code it touched next
  to it is left in the old style, when the rules ask to bring touched code in line.

## What not to report

- What the project's deterministic checks already enforce (the profile's `checks`).
- A preference no written rule states.
- Pre-existing violations the change does not touch.

## Boundaries

- A behaviour defect: correctness. Generated-code patterns and comments: slop. Layering and
  dependencies: architecture. Report here only the written rule; leave the rest to its role.
