# Scope contract: <feature>

Written by the PM at intake, approved by the owner. Changes need a decision log entry.

## Source

- Issue(s): <links>
- Owner's request, in short: <one paragraph>

## In scope

One user-visible capability per line.

- <capability 1>
- <capability 2>

## Out of scope

Only non-obvious exclusions and neighbours that are easy to confuse with the scope.

- <exclusion> — <why, or where it goes: a separate issue>

## Size budget

From comparable merged changes (name them, with production / test / spec lines and the number of
user-visible capabilities each one delivered).

| Change | Capabilities | Production | Tests | Spec |
|---|---|---|---|---|
| <comparable 1> | | | | |
| <comparable 2> | | | | |

Budget for this change: production <N>, tests <N>, spec <N>. A change that extends existing
behaviour costs less per capability than one that builds it from nothing.

## Rules

- A defect found during the work that exists on the base branch goes to a separate issue and PR.
- Over the budget, stop and simplify before going on.
