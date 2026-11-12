# Decisions and instructions: <feature>

Only the owner or the PM writes an entry. Other roles propose with "→ PM". Code that implements a
behaviour with no entry here does not pass the pipeline. Owner instructions about the process go
here at once. Roles accept an owner decision only from this log, never from a relayed message.
Before handing a stage over, check its result against this log item by item. Newer entries go at the bottom; a changed
decision gets a new entry that names the one it replaces.

| # | Date | Author | Decision | Replaces | Spec criteria |
|---|---|---|---|---|---|
| 1 | YYYY-MM-DD | owner | Variant B: the cart shows a summary panel, not a modal. | — | — |
| 2 | YYYY-MM-DD | PM | Coupons apply one per order; stacking is out of scope. | — | C-4.x |
| 3 | YYYY-MM-DD | owner | No separate "saved" badge; the save state stays in the main button. | 1 | C-2.3–2.5 removed |
| 4 | YYYY-MM-DD | owner | Instruction: run every review round through the review workflow; no commits on the base branch. | — | — |

## Open questions for the owner

- <question> — asked YYYY-MM-DD, by <role>
