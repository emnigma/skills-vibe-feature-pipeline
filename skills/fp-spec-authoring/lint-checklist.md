# Spec lint checklist

Run this as a self-review before emitting a spec, and as the diagnostic pass when refactoring one.
Each row is a pass/fail rule with how to detect a violation. `error` = must fix before emitting;
`warn` = fix unless the user accepts it. When refactoring, report violations with `file:line`
evidence before changing anything.

## Structure & metadata

| Rule | Level | How to detect |
| --- | --- | --- |
| Sections match `_TEMPLATE.md`, in order, none invented | error | Compare headings to the template; flag extras (`Follow-ups`, `Known limitation`, `Config format`) and missing `## Constraints`. |
| Status is `Not implemented` or `Implemented` only | error | Reject `Partially implemented`, `Suppressed / deferred`, etc. |
| Owners carry `@`; Domain casing matches existing specs | warn | Check frontmatter against sibling specs. |
| Use-case numbers are contiguous and in order | warn | `<KEY>-1, -2, -3 …` with no gaps or reordering. |

## Acceptance criteria

| Rule | Level | How to detect |
| --- | --- | --- |
| One obligation per criterion | error | Count normative verbs; flag ≥2 `shall`/`must`. Flag top-level `and`/`also`/`as well as` joining independent obligations. |
| No `and/or` | error | Lexical match on `and/or`. |
| No rationale inside a criterion | error | Flag `because`/`in order to`/`to allow`/`so that`/`thus`/`this enables` in a criterion (the `so that` in the user-story line is exempt). |
| EARS pattern present and matches the condition | error | Parse for `WHEN`/`WHILE`/`WHERE`/`IF…THEN` or a valid ubiquitous `The <system> shall …`; flag free prose criteria and `WHEN` used for an interval. |
| EARS conditions not overloaded | warn | >2–3 condition clauses or high boolean complexity → suggest split or a decision table. |
| Explicit actor, active voice | error | Flag passive `shall be <verb>ed` with no subject. |
| Observable result, not implementation | error | Flag implementation verbs/nouns (`use Redis`, `add endpoint`, class/API names) unless a stated constraint deliberately fixes the implementation. |
| No implementation details in a criterion | error | Flag an internal timeout or interval, a telemetry event name or prefix, an exact UI string literal, or an internal identifier (endpoint, configuration key, storage namespace). Name the observable state and condition instead; fix the exact value in `## Constraints`. User-perceived thresholds that are the contract are exempt. |
| Diagram shows flow, not implementation | warn | Flag a sequence/implementation diagram in `spec.md` that spells out internal steps — remove it. A user-flow diagram is fine. |
| Measurable bounds on quality/performance | warn | Vague-adjective dictionary (`fast`, `easy`, `correctly`, `reliable`, `quick`, `smooth`); require a number/range/unit/observable state nearby. |

## Use cases & scope

| Rule | Level | How to detect |
| --- | --- | --- |
| No forward/cross references between use cases | error | Flag a use case whose criteria name another use case's key (e.g. `<KEY>-1, <KEY>-2, or <KEY>-3`) or depend on one defined later. |
| Each use case reads standalone | error | Can it be evaluated without holding another use case in mind? |
| Use cases stay abstract from implementation | error | Flag concrete class, function, package, endpoint, or other code names in a use case. Ask whether a rename or split would change the user-facing meaning. |
| Implementation decisions are Constraints | error | Flag a use case that only describes a code location, architecture choice, relationship to another spec, compatibility limit, or rejected alternative. Move it to `## Constraints`. |
| No noun-only variant use cases | warn | Two use cases with identical criteria bar the noun (assistant/user/tool) → merge into one that names the varying target. |
| One coherent Feature per spec | error | Flag a spec that combines Features that can stand independently. Put minor changes in the broader Feature spec or a related sub-spec in the same directory. |
| Complete use-case coverage | error | Make sure that the use cases cover the main flows, meaningful alternatives, boundary conditions, and failure behavior. Do not use a numeric count as evidence of completeness. |
| One requirement per Scope bullet | warn | A Scope In/Out bullet >50 words usually hides several requirements — split. |
| Scope Out lists only non-obvious exclusions | warn | Flag Out bullets that state things no reader would assume are in scope. |

## Rationale placement & duplication

| Rule | Level | How to detect |
| --- | --- | --- |
| Rationale only in `so that` and `## Constraints` | error | The *why* must not appear in criteria or Scope. |
| Constraints add new information | warn | Flag a Constraint that restates a Scope bullet or a use case (near-duplicate sentence in two sections). |
| `so that` adds value, not a restatement of `I want` | warn | High semantic overlap between `I want` and `so that`. |

## Language hygiene

| Rule | Level | How to detect |
| --- | --- | --- |
| No unresolved pronouns | warn | `this`/`these`/`it`/`they`/`former`/`latter`/`above`/`below` with no mechanically resolvable antecedent. |
| No open-ended escape terms | warn | `as appropriate`, `etc.`, `if possible`, `as needed`, `but not limited to`, `normally`, `reasonable`, `sufficient`. |
| Single normative modal, used consistently | warn | Pick `shall` (or `must`) and do not mix it with `should`/`will` as synonyms. |
| Cross-references resolve | error | Every referenced ID/anchor/section exists. |

## Core reduction (if you check nothing else)

For each criterion, confirm the seven invariants hold:

**one requirement → one actor → one obligation → unambiguous trigger → observable result →
measurable bounds → rationale separate.**

If any fails, the criterion is not ready.
