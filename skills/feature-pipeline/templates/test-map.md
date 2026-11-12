# Test map: <feature>

Kept by QA from the first slice on. One row per acceptance criterion. Every criterion has a test;
every new test has a criterion.

Levels, cheapest first: static rule, unit, component (headless UI), end-to-end.

## <capability>

| Criterion | Test | Level | Purpose |
|---|---|---|---|
| C-4.1 | `CouponTest.valid coupon lowers the total` | unit | the discount rule |
| C-4.3 | `CartPanelTest.second coupon is rejected with a message` | component | the one-per-order rule is visible |

## Criteria with no new test

| Criterion | Covered by |
|---|---|
| C-4.4 | an existing test on the base branch: `<name>` |

## Criteria with no test at all

None.

## Lines per file

| File | Added lines |
|---|---|
| | |
