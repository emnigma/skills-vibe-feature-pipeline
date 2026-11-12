# Feature Pipeline

A plugin that delivers a feature or an improvement from the owner's request to pull requests
through long-lived role subagents: PM, designer, architect, coder and QA, plus review rounds run as
workflows. The owner decides at fixed points; everything else runs on its own.

It exists because agents left alone make the same mistakes on every larger task:

- they fix neighbouring bugs and drift outside the issue;
- the implementation grows far past what similar changes cost;
- tests grow into a second copy of the code;
- review rounds layer fixes on fixes in one area;
- a role that should only design starts deciding product behaviour;
- reports state guesses as facts, and owner instructions get lost between stages.

The pipeline guards against each of these with a written rule.

## Roles and the chain of responsibility

| Role | Decides | Only proposes | Escalates to |
|---|---|---|---|
| Owner | everything | — | — |
| PM | behaviour, scope, acceptance criteria, visible cuts | — | owner |
| Designer | look and interaction within the spec | behaviour changes (→ PM) | PM |
| Architect | code structure, reuse, slices | behaviour and scope changes (→ PM) | PM, designer |
| Coder | code within the design | new abstractions and states (→ architect) | architect |
| QA | the test set, levels, test cuts | spec changes (→ PM) | architect, PM |
| Review (workflow) | nothing: reports findings | fixes | orchestrator |

Every behaviour decision and every owner instruction goes into a log with its author. Code that
implements behaviour with no log entry does not pass. External actions (comments, issues, pushes to
shared branches) need the owner's explicit yes.

## Stages

★ — the owner decides before the pipeline goes on.

0. Profile check (first run: build the profile, ★ approve).
1. Intake: the task in one sentence with a done criterion, a scope contract and an expected size
   from comparable merged changes. ★
2. Research: competitors, UX patterns, an HTML demo with variants. ★ variant
3. Spec. ★
4. UI requirements.
5. Design: prior art, a minimal alternative, 2–3 variants, a reuse map, a lean pass before code, a
   formal model only for state machines or concurrency. ★ if over the expected size
6. Implementation in slices, every test tied to a criterion; for UI, screenshots of the key states
   compared with the chosen variant.
7. QA: test map, one test per criterion at the cheapest level.
8. Review rounds with a base-branch filter and a step-back rule.
9. Size audit against the expected size. ★ cuts
10. Pull requests by the project's layout. ★
11. Demo videos, if the project has a demo skill. ★
12. Owner feedback → decision log → back to the right stage.

Key rules:

- **Out of scope.** A defect that exists on the base branch goes to its own issue and PR, never
  into the feature branch.
- **Step back.** When findings land in the same area two rounds in a row, when a fix repairs an
  earlier fix, or after three rounds, point fixes stop. The architect and the PM re-examine the
  area: remove it, split it out, or redesign it.
- **Stop rule.** Review rounds stop when no earlier fix is incomplete and no confirmed finding is
  above low.

## Contents

| Path | What |
|---|---|
| `skills/feature-pipeline/` | The orchestrator skill, role charters, the profile format, `INSTALL.md`, templates, the review round workflow template |
| `agents/fp-*.md` | The role agents |
| `skills/fp-spec-authoring/` | Writing atomic, testable specs with EARS criteria |
| `skills/fp-code-review/` | Orchestrated review with generic roles and project roles from the profile |
| `skills/fp-formal-spec/` | Lean models and proof obligations for state machines and concurrency |
| `skills/ponytail/`, `skills/ponytail-review/` | The smallest change that solves the task, and a review of whether every line is needed |

## Install

Install the plugin from the catalog and enable it in the project. Start a new session, then ask the agent to take an issue through the feature pipeline.

On the first run in a project, the orchestrator builds the project profile by `INSTALL.md`: it
finds the project's rules file, checks, PR layout, spec folders and the skills that fit each slot,
and asks you to approve the draft. The profile lives in the project
(`<config folder>/feature-pipeline.md`), so everything specific to the project stays there.

Optional slots, used when the project has them: a humanize skill for spec prose, architecture,
coding and test guides, extra review roles, a demo skill. An empty slot gives one warning and the
stage runs without it.

Plugins cannot ship workflows: the orchestrator copies the review round template into the
project's temporary workflow folder for each round.

## License

MIT, except the parts listed in `THIRD_PARTY.md`: `ponytail` and `ponytail-review` (MIT, by
DietrichGebert) and `fp-formal-spec` (derived from seqra/formal-spec, Apache License 2.0, see
`LICENSE-APACHE`).
