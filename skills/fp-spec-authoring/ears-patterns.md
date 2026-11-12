# EARS patterns for acceptance criteria

EARS (Easy Approach to Requirements Syntax) constrains natural language to a small set of sentence
templates. It separates the *conditions that activate* a requirement from the *mandatory system
response*. It is the default form for acceptance criteria.

What EARS does and does not buy you:

- It **improves form** and removes a class of ambiguity (missing trigger, missing actor, buried
  obligation).
- It does **not** prove a requirement is necessary, correct, feasible, or measurable. Apply the
  seven-invariant core from `SKILL.md` on top of the syntax.

## Build every criterion around one mandatory response

`[optional condition clauses] the <system> shall <single system response>`

- Start with the system and its obligation, not with a story, a rationale, or a user path.
- One `shall` per criterion. A second normative verb means a second criterion.
- Name the system/actor explicitly and use active voice.

## The five patterns — pick by the semantics of the condition

Choose the pattern that matches what actually triggers the behavior. Do not vary the pattern for
variety.

| Pattern | Template | Use when |
| --- | --- | --- |
| **Ubiquitous** | `The <system> shall <response>.` | Always-active behavior with no trigger. |
| **Event-driven** | `WHEN <trigger event>, the <system> shall <response>.` | A discrete event or transition occurs. |
| **State-driven** | `WHILE <state is true>, the <system> shall <response>.` | An interval during which a state holds. |
| **Optional feature** | `WHERE <feature is included>, the <system> shall <response>.` | Behavior tied to an optional/config feature. |
| **Unwanted behavior** | `IF <undesired condition>, THEN the <system> shall <response>.` | Error, failure, or disallowed input handling. |

### WHEN vs WHILE

`WHEN` marks an **event / transition** ("when the user sends a message"). `WHILE` marks an
**interval** during which a state is true ("while a turn is streaming"). Keeping them distinct is a
machine-checkable discipline — do not use them interchangeably.

### IF … THEN is not dogmatically "failure"

`IF … THEN` fits undesired conditions, but the boundary between wanted and unwanted behavior can
depend on viewpoint. Do not contort a normal branch into `IF … THEN` just to have used it.

## Composing conditions

Real requirements sometimes stack conditions. Compose keywords **only when the condition genuinely
composes**:

`WHILE <state>, WHEN <event>, the <system> shall <response>.`

When the clauses multiply (more than ~2–3 condition clauses, or a complex boolean), **stop stretching
the sentence.** Split into separate criteria, or move the combinatorics to a small truth table /
decision table next to the use case. A sentence a reader must parse like code has already failed.

## Examples

**Bad — no trigger, no actor, unmeasurable, bundled**

> The checkout system should quickly handle payment failures appropriately and notify the user.

**Good — unwanted-behavior pattern, one obligation, measurable bound**

> IF the payment gateway returns a timeout, THEN the Checkout Service shall display a
> payment-unavailable result within 1 second.

The notification is a separate obligation → a separate criterion.

**Event vs state**

> WHEN the user sends a message, the Chat Session shall append it to the transcript. *(event)*
>
> WHILE a turn is streaming, the Chat Panel shall disable the send control. *(interval)*

## Relationship to Given/When/Then

Do not convert every EARS criterion into Given/When/Then. GWT is for a *few key behavioral examples*
with a real context → event → observable consequence, and follows its own discipline (one `When` per
scenario, ~3–5 steps, declarative not imperative — see `examples.md`). Invariants stay as
`Rule:` statements; normative behavior stays as EARS.
