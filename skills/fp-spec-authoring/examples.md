# Examples — few-shot calibration

Self-contained good/bad excerpts for calibration. The text here is **illustrative and invented** — it
is deliberately not quoted from any live spec, so this file does not rot when repository specs change.
Match the shape, not the wording.

## Good patterns

### Use cases that read standalone

Define a shared term once, then refer to the term — never to another use case.

> *(note under `## Use cases`)* A *notifiable event* is one of: a turn finished, input required, or a
> turn failed.
>
> - WHEN a notifiable event occurs in a chat that is open but not displayed, the plugin shall raise
>   its notification.

Nothing forces the reader to hold a second use case in mind.

### Concrete, measurable thresholds

> - WHEN context-window usage reaches 90%, the plugin shall show the usage indicator in its warning
>   state.

Not "shows a warning when usage is high" — a number makes it pass/fail.

### One EARS obligation per criterion

> **Acceptance criteria:**
> - WHEN an agent turn for a chat finishes, the plugin shall raise a notification naming the chat.
> - WHILE a finished-turn notification for a chat is live, the plugin shall raise no further
>   finished-turn notification for that chat until the agent works on it again.

### Constraints that add new information

> *(in `## Constraints`)* Runtime state is a journal projection that re-emits unchanged values, so
> notifications trigger on state transitions observed after subscription, never on an observed value
> alone.

A design rule that is not already stated in Scope or a use case — that is what Constraints are for.

## Anti-patterns

### Use case tied to concrete classes

> Bad:
> "As a developer, I want `ToolSegmentHeader` to render `ToolCallDisplayStatus` from
> `TurnStatusSettling`, so that the tool row shows the current state."

This use case names classes and an implementation flow. A rename or split would force a spec change
without changing the stakeholder need. Name the visible behavior instead:

> Good:
> "As a developer reading the chat, I want a tool row to show the current call state, so that I can
tell when the call runs, waits for confirmation, fails, or completes."

### Implementation note presented as a use case

> Bad:
> "As a developer, I want the presentation layer to derive tool status once before rendering."

This has an actor-shaped opener, but it does not describe a user context or observable result. It is a
Constraint when the architecture is deliberate:

> Good:
> "The presentation layer derives tool status once before rendering."

### Constraint disguised as a behavior

> Bad:
> "As a developer, I want the tool UI to use a shared root spec and replace framed cards, so that
future changes stay consistent."

The sentence mixes a spec relationship, an implementation choice, and a rationale. Move the design
facts to `## Constraints`, and keep the stakeholder behavior in a use case:

> Good, in `## Constraints`:
> "The tool-call rendering spec belongs under the shared tool UI root spec. The design replaces framed
cards with borderless rows."

> Good, in `## Use cases`:
> "As a developer reading the chat, I want consecutive tool calls grouped into one row, so that tool
activity reads as an execution log."

### Old wording still needs a refactor

> Bad:
> "The tool row uses `ToolSegmentHeader`, as described in the old version of this spec."

When a user asks to refactor a spec, apply the current rules to all of its prose. Do not preserve
implementation names because they were already present. Keep the behavior, then abstract the use case
and move implementation details to Constraints.

### Spec split by an arbitrary use-case count

> Bad:
> "The shopping cart needs twelve use cases, so split cart totals and cart ordering into unrelated
> specs."

A numeric limit does not define a Feature boundary. Keep the use cases together when they describe
one independent Feature. Use a related sub-spec in the same directory when one part needs a separate
document but remains part of that Feature.

### Minor change with an unrelated standalone spec

> Bad:
> "Create a new spec for one additional tool-call status, although tool calls rendering already owns
> that behavior."

Update the broader Feature spec. If the change needs substantial detail, add a related sub-spec in the
same directory. Do not merge the minor change into a different Feature only because that issue is
larger or newer.

### Incomplete Feature coverage

> Bad:
> "The notification spec covers successful delivery but omits unavailable channels, suppression,
> and repeated events."

A spec describes its Feature as a whole. Add use cases for meaningful alternatives, boundary
conditions, and failure behavior. Do not add trivial variants only to increase the count.

### Bundled criterion (one bullet, several failable assertions)

> Bad:
> "Then the unavailable channel is skipped silently, the remaining channels still deliver, and the
> agent turn is unaffected." *(three obligations)*

Split into three EARS criteria (see the before/after below).

### Rationale bleeding into a criterion

> Bad:
> "Then the selection is applied to the session — these are facts of the session, not return values,
> so the call never throws at the caller."

The reasoning after the dash belongs in `## Constraints` (or the user-story `so that`), not in a
pass/fail criterion.

### Cross-reference between use cases (forces non-linear reading)

> Bad:
> "When any notification of NOTIF-1, NOTIF-2, or NOTIF-3 is raised, and the suppression condition of
> NOTIF-5 holds, …" *(depends on four other use cases, one defined later)*

Fix by defining a shared term (`a notifiable event`) once and letting the suppression use case own
the exception as its own rule.

### Subjective / untestable criterion

> Bad:
> "a muted action title, less contrasting than the message text, that reads as a dense activity log."
>
> Bad:
> "the icon draws attention once, without demanding it continuously afterwards."

No reviewer can definitively pass or fail these. State an observable fact instead ("the plugin shall
request icon attention once"); if a "feel" matters, capture the *why* as a Constraint.

### Implementation detail baked into a criterion

> Bad: "IF the backend does not respond within `<N>` seconds, THEN the plugin shall show the request
> as failed."
>
> Good: "IF the backend does not respond before the response window elapses, THEN the plugin shall
> show the request as failed." *(`## Constraints`: the response window is `<N>` seconds.)*

The same applies to telemetry event names ("records one event for the started action") and exact UI
copy ("shows the item as active with its end date"). A threshold the user perceives as the contract
keeps its number.

### Swallowed failure dressed as intended silence

> Bad: "IF a message does not go out, THEN the plugin shall record no interaction for it."
>
> Good: "IF a message cannot be sent, THEN the plugin shall record one send-failed event for it."

### Implementation diagram inside spec.md

A user-flow diagram belongs in `spec.md`; a diagram of internal steps does not.

## Before / after — trimming a bundled criterion

**Before** (bundled: three obligations, one of them a rationale, no explicit trigger form):

> - Then the unavailable channel is skipped silently, the remaining channels still deliver, and the
>   agent turn is unaffected, so that telemetry never blocks the user.

**After** (three EARS criteria, one obligation each; rationale moved to Constraints):

> **Acceptance criteria:**
> - IF a delivery channel is unavailable, THEN the plugin shall skip that channel without surfacing
>   an error.
> - IF a delivery channel is unavailable, THEN the plugin shall still deliver through the remaining
>   available channels.
> - WHILE delivering a notification, the plugin shall leave the agent turn unaffected.
>
> *(in `## Constraints`:)* Notification delivery is best-effort and never blocks an agent turn — an
> unavailable channel is a skipped delivery, not a turn failure.

What moved where: the two channel behaviors are `IF … THEN` (undesired condition); the turn isolation
is `WHILE` (an interval); the *why* ("never blocks the user") left the criteria and became a
Constraint.
