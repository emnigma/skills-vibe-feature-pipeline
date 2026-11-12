---
name: fp-spec-authoring
description: |
    Rules for authoring and refactoring the spec.md of a feature specification in the project's specs folder so it reads as a structured technical doc, keeps user intent clear, and carries atomic, testable acceptance criteria. Acceptance criteria default to EARS syntax.
    Use when writing a new spec.md from an issue, or trimming an existing over-verbose spec.md (bundled criteria, rationale bleed, cross-referenced use cases, prose walls). This skill covers spec.md only.
---

# Spec authoring — Skill Index

Entry point for writing and refactoring the `spec.md` of specs in the project's specs folder (the
`paths.specs` slot of the feature-pipeline profile). Read the
narrowest file that answers your question. Do not read all four unless you are refactoring a spec
end to end.

**Scope: `spec.md` only.** This skill governs how the human-readable spec prose is written. It says
nothing about `contract.yml`, the harness, or how criteria are executed — those are out of scope
and owned elsewhere.

## Files

- **`SKILL.md`** (this file) — when to apply, what a good `spec.md` is, the seven-invariant core, the
  authoring workflow, and the hard/soft rules. Start here.
- **`ears-patterns.md`** — the five EARS sentence templates, how to pick one from the semantics of
  the condition, and how to compose conditions without producing a wall of clauses. Read when
  writing or reviewing any acceptance criterion.
- **`lint-checklist.md`** — the automatable pass/fail checklist. Run it as a self-review before
  emitting a spec, and as the diagnostic pass when refactoring an existing one.
- **`examples.md`** — self-contained good and bad excerpts (illustrative, not tied to any live
  spec), plus a before/after trim. Read for few-shot calibration.

## When to apply

- Writing a new `spec.md` from a GitHub issue.
- Refactoring an existing `spec.md` **only when the user asks** — do not rewrite a spec unprompted.

The canonical prose shape is the project's spec template, named in the profile next to the specs
folder (here called `_TEMPLATE.md`). This skill constrains *how the prose is written*; it never
overrides that file's structure. If the project has no template, use the sections below in this
order.

## What a good `spec.md` is

`spec.md` is **for a human reader**: Description, Value, Scope In/Out, Use cases, Constraints,
following `_TEMPLATE.md` exactly. It answers *what behavior and why*. Its acceptance criteria are
human-readable, atomic, and EARS-shaped — enough for a reviewer to understand and approve intent.

**The failure this prevents:** a spec that tries to make its prose criteria exhaustive and
self-verifying turns its use cases into a several-hundred-line pseudo-contract (see `178`), then
duplicates the rationale into a sprawling Constraints section. Keep the criteria atomic and
readable; do not inflate `spec.md` into an exhaustive test matrix.

## Use-case abstraction and constraint placement

Use cases describe behavior for a human stakeholder. Keep them abstract from code structure so a
class rename, package move, or function split does not change their meaning. Name the actor, the
context, and the observable result. Do not name concrete classes, functions, packages, or other
implementation symbols in a use case unless the symbol is itself the stakeholder-facing concept.

A statement belongs in `## Constraints` when it describes an implementation decision, a compatibility
limit, a migration rule, a relationship to another spec, or a rejected alternative. A statement is
not a use case only because it describes a useful design. A use case needs an actor, a context or
event, and an observable result.

If several related capabilities share a root spec, state that relationship in Constraints. Do not
turn the relationship into a use case or force an unrelated change into the current spec.

For example, this is a use case:

```text
As a developer reading the chat, I want consecutive tool calls grouped into one row,
so that tool activity reads as an execution log.
```

This is a Constraint, not a use case:

```text
The presentation layer derives tool status once before rendering.
```

The second statement describes implementation. It does not describe an actor, a user context, or an
observable user result.

When refactoring an existing spec, apply the current rules to old prose as well as new prose. Do not
preserve a weak use case because it existed before the current change.

## Implementation details belong in Constraints, not in criteria

`spec.md` states observable behavior and its user-perceivable condition. It does not pin the tuning
constants, internal names, or exact literals the implementation happens to choose. A reader approves
*what the user sees and why*, and a later code change to any of these must not force a spec edit.

These are implementation details. Keep them out of Scope, use cases, and acceptance criteria:

- **Internal timeouts and intervals** — a wait window, a refresh cadence, a retry delay. The user
  does not perceive the number as a contract; it is a tuning value.
- **Telemetry event names and prefixes** — the literal event identifiers and their namespace.
- **Exact user-facing string literals** — a label's or notice's exact wording. Name the state the
  user sees, not the copy that renders it.
- **Internal identifiers and locations** — endpoint paths, configuration keys, storage namespaces,
  class/function/package names.

Where each one goes instead:

- A **criterion** names the observable behavior and its condition: *after the wait window elapses*,
  not the duration; *shows the item as active with its end date*, not the literal label; *records one
  event for the started action*, not the event name.
- **`## Constraints` may carry implementation detail.** Fix the exact value there once — the
  duration, the event names, the endpoint shape, the exact copy — so the criterion can refer to the
  condition and stay stable across code changes.
- A sequence of internal steps is not a decision the spec fixes; leave it out of `spec.md`.

**Telemetry criteria** may require that an occurrence is recorded without naming the event; a
criterion may also require that a *non-occurrence records nothing*, but both name the event only in
Constraints. If the spec means a failure to record, say so — do not let a swallowed failure read as
intended silence.

**Diagrams:** a user-flow diagram that illustrates observable behavior belongs in `spec.md`. A
sequence or implementation diagram that spells out internal steps does not; leave it out.

## The seven-invariant core

Every requirement — every acceptance-criterion bullet — satisfies all seven:

1. **One requirement** — one independently pass/fail fact. If half can pass while half fails, it is
   two criteria.
2. **One actor** — a named subject performs the obligation. No passive "shall be rejected".
3. **One obligation** — one normative verb (`shall`/`must`). Multiple normative verbs → split.
4. **Unambiguous trigger** — the applicability/condition is explicit (this is what EARS encodes).
5. **Observable result** — states *what* is observable, never *how* it is implemented. No internal
   tuning value, telemetry event name, exact UI literal, or internal identifier (these belong in
   `## Constraints`).
6. **Measurable bounds** — thresholds, units, and tolerances are explicit; no `fast`/`easy`/`correctly`.
7. **Rationale separate** — the *why* lives in the user-story `so that` and in `## Constraints`,
   never inside the criterion.

## Representation selection

Pick the form from the *kind of information*, not by habit. Do not force one universal template onto
all of it — that is the strongest single lesson across EARS, NASA, Cucumber/Adzic, and RFC/ADR
guidance.

| Information | Form | Notes |
| --- | --- | --- |
| Normative system behavior | **EARS** (default) | See `ears-patterns.md`. Default for acceptance criteria. |
| Invariant / static constraint | **Rule-oriented** statement | `Rule: A username is unique within a tenant`. Do not fake a Given/When/Then for an invariant. |
| A few key behavioral examples | **Given/When/Then** | Only when there is a real context → event → observable consequence. Not for invariants. |
| Stakeholder goal & value | **User story** | `As a / I want / so that`, INVEST-guided. |
| Decision, alternatives, why | **Constraints** section | Design rationale, migration, compatibility, rejected options. |

EARS is the default and is generated by default (per project decision). Deviate from EARS **only if
the user explicitly objects**; if they do, fall back to rule-oriented or Given/When/Then per the
table.

## Authoring workflow (new spec)

1. **Read intent.** The GitHub issue is the root of intent. Do not invent product decisions.
2. **Scope one coherent Feature.** One spec describes one medium-sized Feature that is independent
   from other Features. Put a minor change in the broader Feature spec or in a related sub-spec in
   the same directory. Split the work when it combines independent Features. Examples of suitable
   scope include a shopping cart, a first setup flow, a notifications mechanism, a search panel, a
   file upload dialog, and a history view.
3. **Frontmatter** per `_TEMPLATE.md`: Source issue, Status (`Not implemented | Implemented` — no
   other values), Domain(s), Owner(s) with `@`. Match existing Domain casing.
4. **Description / Value** — one or two sentences each. Value names the beneficiary explicitly.
5. **Scope In/Out** — one requirement per bullet. Out lists only *non-obvious* exclusions and
   confusable neighbors, not everything the spec does not do.
6. **Use cases** — cover the complete Feature behavior, including its main flows, meaningful
   alternatives, boundary conditions, and failure behavior. Each use case is standalone: no forward
   references to another use case. Merge use cases that differ only by a noun (assistant/user/tool)
   into one whose criteria name the varying target. Keep use cases abstract from classes, functions,
   packages, and other implementation names. Describe the stakeholder, context, and observable result.
   Move implementation decisions to Constraints. Do not limit the count or create trivial variants to
   appear complete.
7. **Acceptance criteria** — EARS by default, one obligation each. Each criterion states an
   observable result; keep it atomic rather than exhaustive.
8. **Constraints** — only cross-cutting, non-obvious rationale/alternatives/compat. Never restate
   Scope or a use case. Put implementation decisions and relationships between related specs here
   when they matter to the design.
9. **Self-review** against `lint-checklist.md` before emitting. Then stop and report; do not perform
   unrequested git/GitHub writes.

## Refactoring workflow (existing spec — only when asked)

1. Run `lint-checklist.md` over the spec; report findings with `file:line` evidence first.
2. Trim in place: unbundle multi-assertion criteria; lift rationale out of criteria into
   `so that`/Constraints; break forward references so each use case reads standalone; merge
   noun-only variant use cases; remove code names from use cases; move implementation decisions and
   cross-spec relationships to Constraints; convert prose criteria to EARS.
3. Do not change meaning while trimming. A renamed/repurposed criterion that a consumer already
   relies on is a behavior change, not a wording fix — flag it, do not silently make it.
4. Apply this treatment to a spec whose use cases bundle several assertions per criterion,
   cross-reference one another, bury rationale inside criteria, or restate Scope in Constraints —
   the symptoms the lint checklist flags.

## Hard rules (must not be violated)

- **Atomic, human-readable criteria.** `spec.md` prose stays human-readable; each criterion is one
  observable, reviewable fact. Do not inflate use cases into an exhaustive self-grading test matrix.
- **One obligation per criterion.** No bundled assertions. Ban top-level `and`/`also`/`as well as`
  joining independent obligations, and ban multiple `shall`/`must` in one sentence.
- **Ban `and/or`.** Spell the boolean out: `A`, `B`, `A or B`, `at least one of {A, B}`.
- **Rationale out of criteria.** No `because`/`in order to`/`to allow`/`so that` inside an
  acceptance criterion. (`so that` is allowed only in the user-story line.)
- **One coherent Feature per spec.** The Feature is independent from other Features. Minor changes
  belong to the broader Feature spec or a related sub-spec in the same directory.
- **Complete use-case coverage.** Cover main flows, meaningful alternatives, boundary conditions,
  and failure behavior. Do not use a numeric use-case limit.
- **No forward references between use cases.** Every use case is readable standalone.
- **EARS by default** for acceptance criteria; deviate only on explicit user objection.
- **Observable, not implementational.** Criteria state *what*, not *how*. No implementation verbs
  (`use Redis`, `add endpoint`) unless the implementation is a deliberate, stated constraint.
- **No implementation details in criteria or use cases.** Keep internal timeouts and intervals,
  telemetry event names and prefixes, exact UI string literals, and internal identifiers (endpoints,
  configuration keys, storage namespaces, class/package names) out of Scope, use cases, and criteria.
  Name the observable state and condition; fix the exact value in `## Constraints`.
- **Structure matches `_TEMPLATE.md`.** No invented sections, no non-standard Status values, no
  out-of-order use-case numbering, owners carry `@`.
- **No unrequested writes.** Do not touch git, GitHub, issue fields, or unrelated files.

## Soft rules (should)

- **Measurable bounds.** Replace `fast`/`easy`/`correctly`/`reliable` with a threshold, unit, or an
  explicitly observable state.
- **Name a real stakeholder.** Prefer a domain-specific actor over a generic `As a user` when one
  changes the need.
- **`so that` adds value.** It should not restate `I want` in other words.
- **Resolve pronouns.** Avoid `this`/`these`/`it`/`above`/`below` when the antecedent is not
  mechanically resolvable.
- **Keep bullets to one thought.** A Scope or Constraints bullet running 50+ words usually hides
  several requirements — split it.
- **Prefer few, well-distributed use cases** over many clustered on trivial variations.
