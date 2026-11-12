---
name: write-packet
returns:
  head: string
  significant: integer
---
You prepare the review packet for round __ROUND__ of a code review, by the packet section of the `fp-code-review` skill (read its SKILL.md). Do not review the code and do not edit any file except {{dir}}/PACKET.md.

Checkout: __CHECKOUT__, branch __BRANCH__, head __HEAD__. Base: __BASE__ (the merge base with __BASE_BRANCH__).
Pinned by the orchestrator: {{dir}}/scope.diff (base..head, without scratch paths) and {{dir}}/significant.txt (production files).

Write {{dir}}/PACKET.md:
- Target, base, head, the full commit list (`git log --format='- %h %s' base..head`).
- The change in scope, from the spec __SPEC__: __CAPABILITIES__
- What changed since the previous round: __CHANGED_SINCE_LAST__
- Group the significant files: __GROUPING_RULE__. List every file of significant.txt in exactly one group.
- Roles run and skipped, with a one-line reason each: __ROUTING__
- Section "Review focus": (1) regressions — behaviour that works on the base branch and is broken by this branch; (2) the capabilities against the spec; (3) leftovers of removed or reverted code; (4) unneeded infrastructure. Out of scope and to be dropped: defects that exist on the base branch unchanged, and the issues already split out: __SPLIT_OUT__. Known and accepted: __ACCEPTED__.
- Prior rounds: list each earlier REPORT.md; reviewers check that its fixes in their files are complete and title an incomplete one "Incomplete fix: round N #M — …".
- The orchestrator check from the skill and its result.
- A "Validation decision" section with "(filled after the review wave)".

Report the head and the number of significant files.
