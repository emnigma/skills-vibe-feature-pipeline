---
name: fp-formal-spec
description: Structure agent reasoning about consequential behavior with a model, independent specification, proof obligations, and Lean proofs, then derive tests and implement through TDD. In the feature pipeline, use it for state machines and concurrency only. Skip cosmetic changes.
---

> Derived from [seqra/formal-spec](https://github.com/seqra/formal-spec), Apache License 2.0.
> Modified by Max Nigmatulin, 2026: see `NOTICE.md` next to this file.

## Use in the feature pipeline

- The architect decides whether the feature needs a model: only for a state machine, concurrency,
  or ordering rules that tests alone are unlikely to cover.
- Build the model fresh for the feature, in the profile's scratch folder. Never ship it with the
  feature and never commit it to the product repository.
- QA uses the model to list the cases it covers and the tests that miss them, and keeps the model
  in step with the code while the feature changes.
- The model is a tool for finding missed cases, not a deliverable: when the owner cuts behaviour,
  cut the model with it.

# Formal Spec

`formal-spec` is an architecture for agent reasoning about consequential
behavior. Its core artifacts are:

```text
program model + independent specification + obligations + proofs
```

The specification states intended behavior independently of the source. A
proof discharges an obligation tying the model to that specification. Complete
that reasoning before deriving implementation tests and writing the change.
Aim for one-shot TDD: settle the behavioral design first, write tests with
specification-derived expectations, observe the missing behavior, and implement
against that target. First-pass success is an aim, not a promised result.

This skill uses Lean to check model proofs. A source-level translation proof is
an optional stronger path: when it connects source semantics to the model,
compose the proofs into a theorem about the source program. Model-derived
tests provide finite evidence about the executable without requiring a
translator or a general-purpose verification backend.

Do not formalize every change. Formalize an invariant when its failure would
materially affect users, data, money, access, compatibility, safety, or a
stateful protocol. Use ordinary implementation tests and review for cosmetic
changes and low-consequence work.

Read [references/workflow.md](references/workflow.md) before starting a
consequential formal change. Read
[references/testing.md](references/testing.md) when deriving, reviewing, or
describing conformance-test coverage. Read
[references/verification-architecture.md](references/verification-architecture.md)
when building or reviewing source-level translation, generated obligations, or
proof-carrying models.

## Follow the proof-first loop

1. **Bound the behavior.** State the inputs, states, observations, effects,
   exclusions, external assumptions, and consequence of failure.
2. **Specify intent before implementation.** Write the smallest non-vacuous
   Lean predicate, relation, data type, or transition system. Include an
   accepted case and a rejected or boundary case. Keep the specification
   independent of the current implementation.
3. **Model the selected behavior.** Add the smallest Lean model needed for the
   claim. Add source semantics only for a source-level theorem. If a translator
   is used, prove its correctness
   or check a certificate for the actual AST and model. State whether the
   source boundary is bytes, parsed AST, IR, or another representation.
4. **Generate obligations and prove them.** Make each obligation visibly tie
   the current model to the independent spec. Separate safety, functional,
   and invariant or termination claims when relevant. Keep assumptions
   explicit. For stateful behavior, prove the initial-state condition and
   transition preservation needed for the invariant.
5. **Compose source correctness when justified.** Combine translation
   soundness with the model-to-spec proof. State the final theorem against
   source semantics. If there is no checked source-to-model relation, keep the
   result explicitly at model level.
6. **Derive tests before implementing the change.** For an executable change,
   use the completed model, spec, obligations, and proof to derive a finite set
   of corner, boundary, and representative cases. Read them from proved
   partitions, constructors, relations, or transition guards. Run them against
   the existing implementation or test harness and confirm that the new cases
   expose the missing behavior. A purely formal task may end at the proof.
7. **Review any adapter.** Review how the adapter constructs inputs, invokes
   the implementation, observes outputs, errors, state, and effects, and
   handles setup, cleanup, nondeterminism, and external assumptions. The
   adapter review is part of the formal change.
8. **Implement and execute.** Write the change to satisfy the established
   tests, then run model-derived conformance tests and existing regression
   tests. Recheck formal artifacts if the model changes. Check translation
   evidence when that optional path applies. Keep the formal theorem and test
   evidence separate.
9. **Reconcile surprises.** Feed unexpected production or test behavior back
   into the specification or model. Classify the issue before changing an
   expected result: source defect, model gap, adapter defect, missing
   requirement, changed intent, or environmental assumption.

A source path, hash, annotation, or generated report is not translation
evidence. A checked source-to-model theorem can support a source-semantic
claim within its stated boundary. Without one, a reviewed adapter and finite
conformance tests provide only finite implementation evidence; they do not
establish symbolic equivalence. Neither route silently proves that source
bytes were parsed faithfully or that a deployed executable preserves the
modeled semantics.

## State coverage precisely

Use exact coverage language:

- **Finite domains:** call runtime tests exhaustive only when the
  implementation domain itself is explicitly finite, the case set is proved
  sound and complete for that domain, and the adapter executes every case.
- **Infinite domains:** a finite test suite is sampling, even when its cases
  are generated from a proved partition. Derive corner, boundary, and
  representative cases instead of attempting infinitely many tests. A
  symbolic theorem may quantify over every value represented by the model and
  its assumptions. A composed translation theorem can extend that claim to
  source semantics within its proved boundary.
- **Stateful systems:** an inductive proof can cover every model-reachable
  state when initialization and transition premises are proved. Executable
  conformance tests cover only the finite traces, initial states, and effects
  that the adapter runs and observes. Do not call those tests exhaustive for
  an unbounded state space.

Never claim coverage of behavior that the model, proof, generated cases, or
adapter does not represent.

## Keep the formal artifacts small

- **Specification:** the user's normative intent, independent of current
  source behavior.
- **Model:** the smallest account of behavior needed by the proof. Add it for a
  consequential claim or a design where the model materially clarifies
  implementation.
- **Obligations:** exact theorem types connecting the current model and spec,
  with safety, functional, and invariant or termination claims as needed.
- **Proof:** checked terms inhabiting those obligations and, where justified,
  a composition theorem for the source program.
  Do not use `sorry`, `admit`, unapproved axioms, or unsafe escapes.
- **Conformance tests:** cases and expected observations derived from proved
  behavior and run against the implementation through a reviewed adapter.

Reuse an existing specification, model, and theorem when they already cover
the behavior. Extend them when the invariant genuinely changes. Do not weaken
the specification merely to make the current implementation pass. Preserve a
new counterexample as a formal case, conformance test, or explicit assumption.

`LibSpec/` provides small relation and transition-system primitives, plus
helpers for finite model-derived test vectors. Use them when they make a proof
or test generator clearer; direct Lean definitions are also appropriate.

## Describe each formal source file for readers

Read [references/descriptions.md](references/descriptions.md) when a project
needs the reader-facing description of its formal package. The description
generator writes a replaceable Markdown tree under `formal/.formal-spec/` that
mirrors the public formal source tree. Every public project Lean source file
gets one corresponding Markdown document. The tree also contains
`index.md`, which links the documents, and `vocabulary.md`, which contains the
generated cross-file vocabulary.

Each per-file document is a standalone, human-readable specification of the
declarations in that source file. It must explain the terms, accepted and
rejected cases, conditions, transitions, and established properties needed to
understand the file without opening Lean. It must not contain Lean source,
formal types, proof terms, or code blocks. It may contain a visible relative
link to its source file for provenance; that link is evidence of origin, not a
requirement for understanding the document. Do not maintain a second
hand-written informal specification beside the generated document.

Treat the document as an audit interface, not a prose dump. Preserve logical
structure: conditions and guarantees become separate lists, records and states
become tables, transitions separate preconditions from effects, and theorems
show checked status, scope, assumptions, and result. The index shows file-level
completeness and formal-object counts. Read
[references/descriptions.md](references/descriptions.md) for the full rendering
contract.

Descriptions are derived from elaborated Lean objects and their dependency
graph. The generator uses every referenced term in natural language, chooses
the shortest name that remains unique in the current context, and adds
qualifiers when contexts overlap. Generated term definitions live in the
separate `vocabulary.md`, not in repeated glossary sections inside each
per-file specification.

The only agent-facing extension point is a small `describeAs` vocabulary
override when a declaration's generated name is not a useful domain term. An
override changes presentation only; it cannot change the object,
dependencies, conditions, or proof. Do not add hand-written paragraphs to the
generated output or expose a registry of descriptions that can drift.

The renderer fails visibly. Every source file still receives a document, but
an unsupported construct or unresolved name is marked as an unavailable
description in that document and in `index.md`; the generator's checking mode
must also return a failure for CI. It must never guess, silently omit a
declaration, or hide an ambiguity. The generated documents contain no Lean
types as a fallback. A readable description is not itself a proof, and a
generated document does not establish implementation conformance.

## Use ASD-STE100 for writing

Use ASD-STE100 Simplified Technical English for English prose written with
this skill, including documentation, comments, generated descriptions, and
reports. Apply its writing rules and controlled dictionary. Use approved words
with their specified meanings and parts of speech. Use consistent technical
terms and explain them when needed. Consult the
[official ASD-STE100 reference](https://www.asd-ste100.org/STE_faq.html) and
the standard for detailed rules and dictionary entries.

Preserve code, commands, formal identifiers, quotations, and mathematical
notation. Keep every condition, assumption, and guarantee when simplifying
prose. For generated descriptions, apply these requirements in the renderer
and vocabulary; do not edit generated output by hand. Review the prose against
the standard before claiming ASD-STE100 compliance.

## Finish with exact evidence

Report the source boundary, specification, generated obligations, checked
translation and correctness theorems, modeled behavior, applicable conformance
tests and adapter review, commands and results, coverage class, and remaining
assumptions. Call missing evidence `unknown`. Do not promote a finite test
sample, successful compilation, or a theorem about an incomplete model into a
stronger claim.
