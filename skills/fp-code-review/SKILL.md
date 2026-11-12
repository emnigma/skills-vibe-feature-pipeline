---
name: fp-code-review
description: |
  Orchestrated code review. The orchestrator resolves the scope itself, pins it to git refs, routes
  the change to independent reviewer subagents (correctness, project rules, AI slop, plus
  architecture, concurrency, security and the project's own roles by the area the change touches),
  validates their findings one by one, and writes one deduplicated report. Use when the user or the
  feature pipeline asks to review code, a PR, a diff, a commit, a branch or files.
---

# Code review

You are the review orchestrator. You do not replace the reviewers, and you do not edit code under
this skill. Your job:

1. resolve and pin the scope yourself;
2. scale the pipeline to the scope and write the review packet;
3. route the change to reviewer roles;
4. run the reviewers in parallel, each as an independent subagent with one role;
5. decide whether to validate, and if so validate each reviewer's findings separately;
6. write one deduplicated report.

Inside the feature pipeline, a review round runs as a workflow built from the
`feature-pipeline` template; it follows the same steps.

Work autonomously. Ask the user nothing about reviewers, validation or scope unless the scope
cannot be resolved at all (step 1).

## Project configuration

Read the feature-pipeline profile if the project has one (`feature-pipeline.md` in the agent's
configuration folder):

- `rules-file` — the rules the `project-rules` role checks;
- `checks` — deterministic checks; reviewers do not report what they already enforce;
- `paths.specs` — where the spec of the change lives;
- `paths.scratch` — where the review folder goes (default `.tasks/`);
- `review-roles` — extra role files with their triggers.

Without a profile, use the project's rules file (`AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`) and
`.tasks/` as the scratch folder.

## Hard constraints

- Do not choose a model or a profile for any subagent. Every one runs on the default.
- Review the pinned diff, never the live working tree (step 1).
- One reviewer = one subagent = one role file. Never merge roles into one subagent.
- A finding without a location the reviewer has read — a file and line, or a file and symbol — is
  not a finding.
- Read every reviewer and validation artifact yourself. A subagent's summary is not its result.

## 1. Resolve and pin the scope

1. If the user named a target — a PR, commit, range, branch, files — review exactly that.
2. Otherwise: the current branch against its merge base with the default remote branch, committed
   and uncommitted changes; if empty, the last commit; if still empty, ask one short question.
3. Untracked files: list them with `git ls-files --others --exclude-standard`; include those that
   belong to the change and name the excluded ones in the packet.

Pin it:

- Record the base SHA and the head SHA.
- Write the full diff to `<scratch>/<name>-review/scope.diff`. Every reviewer and validator reads
  this file, not `git diff` of the moment. Append untracked files with
  `git diff --no-index /dev/null <file>`.
- Reviewers read the checkout for context, so it must be at the head. If the target is not checked
  out, create a worktree at the head and remove it after the report.

## 2. Scale the pipeline

A significant file is production code. Tests, Markdown, resources and generated files are not
significant, but they stay in the diff.

| Scope | Pipeline |
|---|---|
| Small: at most 3 significant files and no new type | Always-on roles plus triggered area roles. Validation usually off. |
| Medium | Full routing. Validation by the rule in step 6. |
| Large: more than 25 significant files, or unrelated clusters | Split by meaning into clusters; full routing per cluster. |

A reviewer pass takes at most 15 significant files; split larger clusters into meaningful groups and
tell each pass which groups the others cover. Run at most 10 subagents at once.

## 3. Write the review packet

Create `<scratch>/<name>-review/` with `review/` and `validation/` inside, and write `PACKET.md`:

- the target, base SHA, head SHA, the path to `scope.diff` and the checkout to read;
- the changed files, marked significant or not, and what is out of scope;
- what the change is for: the PR text, the issue, the commit messages;
- the spec it implements, if any;
- the affected modules and their nearest callers and callees;
- the routing decision with a one-line reason for each role run or skipped.

## 4. Route the change to roles

Each role has a file in `roles/` next to this one, or in the profile's `review-roles`.

### Always-on roles

| Role | File | Checks |
|---|---|---|
| Correctness | `roles/correctness.md` | Behaviour defects, removed behaviour, cross-file breakage, missing regression tests. |
| Project rules | `roles/project-rules.md` | The rules in the project's rules file. |
| Slop | `roles/slop.md` | Machine-generated crutches, overengineering, slop comments, fake defensiveness, duplication. |

Skip an always-on role only for a pure rename or move, a config, docs, CI or generated-only diff,
or a trivial one-line fix. Record the reason.

### Area roles

| Role | File | Trigger |
|---|---|---|
| Architecture | `roles/architecture.md` | A new, moved or removed type; changed dependencies of a constructor, module or package; a new port or adapter; a new state or status type. |
| Concurrency | `roles/concurrency.md` | Async code, threads, locks, streams of events, lifetimes and scopes, external processes. |
| Security | `roles/security.md` | Process execution, file paths and writes, downloads, credentials, network, parsing of untrusted input, permissions. |
| Project roles | the profile's `review-roles` | Each by its own trigger. |

Run a role when the change touches its area. Do not run every role for symmetry.

### Ad-hoc roles

If the change has an aspect no role covers, add up to 2 ad-hoc reviewers with a role name, a focus
of one or two sentences, and the evidence that made you add it. They follow `roles/README.md`.

## 5. Review wave

Start the reviewers in parallel. Every handoff contains, in this order:

1. The paths to `roles/README.md` and the role file, with "read and follow them".
2. The target, base SHA and head SHA.
3. The paths to `PACKET.md` and `scope.diff`.
4. For a split pass: the files of this pass and the groups other passes cover.
5. Any role-specific focus from routing.
6. The output path: `<scratch>/<name>-review/review/<role>.md`.

A subagent starts with no context: give it file paths, not names. When all finish, read every file
in `review/`.

## 6. Validation wave

Validate when any finding is `high` or `critical`, when a reviewer reported more than 5 findings,
or when the scope is medium or large. Otherwise you may skip it and mark the report "validation
skipped".

- One validator per reviewer artifact: `review/<role>.md` → `validation/<role>.md`. Never one
  validator for several artifacts.
- Its directive: read `validation.md` next to this file and follow it; the input and output paths;
  one finding at a time, never a batch.

When all finish, read every file in `validation/`.

## 7. Report

1. Take the confirmed findings: `TP` from validation, or all findings when validation was skipped.
2. Merge duplicates across roles and passes into the clearest finding with the most precise
   location. Keep every source role.
3. Write `<scratch>/<name>-review/REPORT.md`:

```markdown
## Review: <target>

**Scope:** <base>..<head>, <N> files (<M> significant)
**Roles:** <roles run>; skipped: <role — reason>
**Validation:** done | skipped — <reason>
**Statistics:** <reported> reported, <TP> confirmed, <FP> false positive, <NMD> need more data, <U> unique after merge

### Summary
<Two or three sentences: what the change does and what, if anything, is wrong with it.>

### Confirmed findings
#### <severity> — <title>
- **Location:** `path/to/file:12-18`
- **Source:** <role>[, <role>]
- **Rule:** <the rule, invariant or doc it violates, if any>
- **Problem:** <what is wrong and why, with the evidence>
- **Fix:** <the minimal fix>

### Need more data
- <title> — `path:line` — <what is missing>

### False positives
- <count>
```

An empty findings list is a valid result. Do not raise a severity or keep a weak finding to avoid
reporting nothing.

## Anti-patterns

- Reviewing the live working tree instead of the pinned diff.
- Running every role on a three-line diff.
- One subagent for several roles; one validator for several artifacts; judging findings in a batch.
- Building the report from summaries without reading the artifacts.
- Reporting what a deterministic check already enforces.
- Editing code under this skill.
