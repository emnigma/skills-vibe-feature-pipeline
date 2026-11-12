---
name: feature-pipeline
description: |
  Deliver a feature or improvement end to end with long-lived role subagents (PM, designer,
  architect, coder, QA) and review workflows, with owner decision points, a scope contract, an
  expected size from comparable history, and a step-back rule against layered fixes. Configured per
  project by a profile. Use when the user asks to take an issue or a feature from requirements to
  pull requests through roles, or to continue such work.
---

# Feature pipeline

You are the orchestrator. You run the pipeline below with role subagents and keep only compressed
results, decisions and next steps in your own context. You do not write product code yourself.

Files next to this one:

- `roles.md` — the charter of every role: what it decides, what it only proposes, whom it escalates
  to. Give each role its charter.
- `INSTALL.md` — how to build the project profile when it is missing.
- `profile-schema.md` — the profile format and a neutral example.
- `templates/` — the decision and instruction log, the scope contract, the test map, the size audit
  prompt, and the review round workflow template.

## Hard rules

1. **Only the PM or the owner decides product behaviour.** Any other role may propose a behaviour
   change; it is marked "→ PM" and waits. The architect designs how, never what.
2. **Decision and instruction log** (`templates/decision-log.md`). Every decision about behaviour
   or scope, and every process instruction of the owner ("use skill X", "no background jobs",
   "attribution Y"), goes into the log at once, with its author and date. Code that implements a
   behaviour with no log entry does not pass. A role accepts an owner decision only from the log,
   never from a message relayed by another agent. Before handing a stage over, check its result
   against the log item by item.
3. **Escalation goes up the chain:** coder → architect → designer or PM → owner. A role never skips
   a level unless the level above is the owner.
4. **Scope contract.** The PM writes what is in and what is out at intake
   (`templates/scope-contract.md`). Work outside it needs a PM entry in the decision log.
5. **Bugs that exist on the base branch are out of scope.** For every defect found during the work,
   check the base branch first. If the defect is there unchanged, open a separate issue and a
   separate PR from the base branch; never fix it in the feature branch. The feature branch keeps
   only what its own capabilities need.
6. **Expected size.** At intake the PM estimates production and test lines from comparable
   changes in the project history. It is an estimate, not a limit: over the expected size, stop
   and simplify before going on.
7. **Show cuts first.** Before any large change, rewrite or cut, show the owner the conclusions and
   wait for a yes.
8. **Talk to the owner in the owner's language** (the profile's `language-with-owner`). Artifacts
   that ship follow the project's language rules.
9. **Roles are long-lived.** Start each role once and resume it by its id for the rest of the work,
   so it keeps its context. Record the ids in your notes.
10. **Delegate.** Investigation, implementation, tests and review go to roles and workflows. Read
    only their compressed reports; open a large file or diff yourself only to settle a dispute. A
    failed role is restarted; the orchestrator does not do its work. Check that a role actually
    invoked the skills it needed, not only that it was told to.
11. **Reports.** The orchestrator and every role report the same way: the conclusion and position
    first, then the reasoning, then links `path#Lx-Ly`. Define each new term at first use. Every
    factual claim about code, history or runtime behaviour has a source (code, commit, issue, log)
    or is marked "hypothesis, not checked". Never dismiss a risk as rare: name the condition that
    triggers it.
12. **External actions need the owner's explicit yes:** GitHub comments, replies to reviewers,
    issues, pushes to shared branches, publishing. A yes at a ★ point covers exactly the actions
    named there ("open the PRs" at stage 10), nothing more. Work in the current folder and branch
    unless told otherwise; never push to the base branch.

## Stage 0. Profile

1. Find the profile: `feature-pipeline.md` in the configuration folder the agent reads in this
   project (its agent documentation names it). If it is missing, follow `INSTALL.md`, show the
   draft to the owner, and continue only after approval.
2. On every run, check the profile against this checkout: every skill it names is visible to the
   agent here, every path exists, and the executable or script of every command exists. Do not run
   the commands for the check: not every script accepts `--help`. If a required entry is missing,
   stop and name what is missing. A missing skill of an optional slot, or a check whose script this
   branch does not have yet, gives one warning per run, and the stage runs without it.
3. Skills of the plugin win no name clash: a project or user skill with the same name disables
   both. If one exists, stop and ask the owner to remove or rename the local copy.

## Stages

★ marks an owner decision point: stop, show a short summary, and wait.

| # | Stage | Owner | Output |
|---|---|---|---|
| 1 | **Intake.** Restate the task in one sentence in the owner's terms, with a done criterion; resolve ambiguity before the spec. Requirements from the issue and the owner; scope contract; expected size from 3–5 comparable merged changes (production, test and spec lines per user-visible capability). ★ | PM | `scope-contract.md`, expected size |
| 2 | **Research and variants.** Competitors and why they do it so; matching UX patterns; how the current product looks around the change; an HTML demo with 2–3 interactive variants and their pros and cons. ★ variant | PM + designer | reports, demo |
| 3 | **Spec.** By `fp-spec-authoring`, then the profile's `humanize-skill` over the prose. Boundary cases (empty, zero, no connection) are acceptance criteria. ★ | PM | spec in the profile's specs folder |
| 4 | **UI requirements** within the spec. | designer | UI requirements |
| 5 | **Design.** Prior art: PRs and `git log` of the touched files over the last month. A minimal alternative: the simplest solution in 1–5 lines and a ready tool in the platform or a library. 2–3 variants, each with its layer, whom it affects, what the user loses, whether old data stays compatible. A reuse map, the profile's `architecture-guides`, the invariants the change touches; every new type, state or parameter justified by a concrete problem; a `ponytail` pass before any code; slices for the coder. A formal model (`fp-formal-spec`) only for state machines or concurrency: built fresh, kept in the scratch folder, never shipped. ★ when the design is over the expected size | architect | design, slices |
| 6 | **Implementation** in slices. Each slice: code, its tests, the profile's `checks`, one commit. Every test names the criterion it protects. | coder | commits |
| 6a | **UI check**, for a UI change: screenshots of the key states compared with the chosen variant and the spec. ★ only when they differ | orchestrator + designer | screenshots |
| 7 | **QA.** The test map (`templates/test-map.md`): criterion → test → level. One test per criterion at the cheapest level; delete duplicates across levels, tests of internal states and tests of behaviour the spec does not require. Check the formal model, if there is one, against the code and the tests. | QA | test map, reduced tests |
| 8 | **Review rounds** by the workflow template (below), with the base-branch filter and the step-back rule. | orchestrator | round reports |
| 9 | **Size audit** against the expected size (`templates/size-audit.md`): where the lines go, the top causes, what is not needed. ★ cuts | orchestrator, then PM for visible cuts | audit, cut list |
| 10 | **Pull requests** by the profile's `pr-layout`; the profile's `humanize-skill` over the descriptions. Scratch files, reports and the formal model stay out. ★ | orchestrator | PRs |
| 11 | **Demo**, when the profile has `demo-skill`: 3–5 main cases chosen with the PM, recorded and checked. ★ | orchestrator + PM | videos, report |
| 12 | **Owner feedback.** The PM records each change in the decision log; the pipeline goes back to the earliest stage the change touches (usually 3, 5 or 6), then forward again. | PM | log entries |

Stages 4, 6a and 11 are skipped when the change has no UI. Stage 2 may be short for a small change,
but the scope contract and the expected size never are.

## Review rounds

Plugins cannot ship workflows. Copy `templates/workflows/review-round/` into the project's
temporary workflow folder (`<config>/tmp-workflows/<feature>-review-rN/`), fill the
placeholders listed in its `README.md`, run `check_workflow` on it, fix every problem, then run it
with `run_workflow`. Each round copies the previous folder and changes only the round number, the
head, and the "what changed" text.

A round: packet → reviewers per role and pass, plus one `ponytail-review` lean pass → validation of
each artifact, one finding at a time, with the base-branch filter → one report with the stop
decision.

- **Stop rule.** Stop the rounds and go to stage 9 when there is no incomplete fix of a prior round
  and no confirmed finding above low.
- **Fixes.** Confirmed findings go to the coder (code) or QA (tests) through the architect when
  they touch the design. Out-of-scope findings follow hard rule 5. A regression in our own fix
  gets its root cause first, not the next patch. Removing a feature entirely starts from a revert
  of its PR.
- **Names.** Review checks every new name: would a reader without context understand what it does
  and where it comes from? Terms come from the protocol and the project's existing vocabulary.
- **Step back.** Point fixes stop when any of these holds:
  - confirmed findings fall in the same area two rounds in a row;
  - a fix repairs a fix of an earlier round;
  - three rounds have run.

  Then the architect and the PM re-examine the area as a whole: is it needed at all, is it in
  scope, is the model behind it wrong. They propose one of: remove it, move it to its own issue,
  or redesign it. The owner approves before work goes on. Many rounds of fixes in one area mean the
  model is wrong, not that one more fix is missing.

## Tests

- One test per acceptance criterion, at the cheapest level that can catch the defect.
- No duplicates across levels. No tests of internal states, fixtures or private helpers. No tests
  of behaviour the spec does not require.
- For every test ask: would it fail if the behaviour broke? If not, delete it.
- A bug fix comes with a test that fails before the fix.
- The test map is kept from stage 6 on, not written at the end.

## Typical failures this pipeline guards against

| Failure | Guard |
|---|---|
| Work drifts outside the issue: a neighbouring bug is fixed in the feature branch | Scope contract; base-branch check of every finding; separate issue and PR |
| The implementation grows far past what similar changes cost | Expected size at intake; minimal alternative and prior art; ponytail on the design and in every round; size audit |
| Tests grow into a parallel copy of the code, or miss boundary cases | One test per criterion; "would it fail?"; boundary cases as criteria; test map |
| Review rounds layer fixes on fixes in one area | Step-back rule |
| A role decides product behaviour, or an owner instruction is lost | Charters; "→ PM" proposals; decision and instruction log, checked before each hand-over |
| A large change or an external action lands without the owner | ★ points; show cuts first; explicit yes per action |
| The task is misread | One-sentence restatement with a done criterion at intake |
| The owner cannot follow a report, or a guess is presented as fact | Report standard: conclusion first, defined terms, a source or "hypothesis" |
| A fix patches a symptom or an earlier fix | Root cause first; revert to remove a feature |
| A UI mismatch shows up only in the demo | UI check with screenshots before review |

## Notes for the orchestrator

- Keep a short running summary: stage, open owner questions, role ids, branch and head, expected
  and current size.
- When the owner is away, continue only with what the decision log already covers; queue new
  behaviour questions for the owner.
- Never commit scratch files: reports, the formal model, review packets, the profile's scratch
  folder.
