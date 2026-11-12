---
name: validate
returns:
  output: string
  tp: integer
  fp: integer
  needMoreData: integer
---
Read the validation rules of the `fp-code-review` skill (`validation.md`) and follow them.

Input artifact: {{input}}
Output path: {{output}}
Packet: {{dir}}/PACKET.md. Pinned diff: {{dir}}/scope.diff. Checkout: __CHECKOUT__ at head __HEAD__.
Recorded decisions to check findings against: the spec __SPEC__, the decision log __DECISION_LOG__, and the packet's "Review focus".

Base-branch filter: for every behaviour finding, check __BASE_BRANCH__ (`git show __BASE_BRANCH__:<path>`, or a temporary `git worktree add` that you remove at the end). If the base branch has the same defect unchanged, the verdict is FP with the reason "out of scope: exists on the base branch". A finding this branch introduces or makes worse is in scope; say which commit or line introduced it.
For a ponytail finding: TP only if the code is not needed for a spec criterion and removing it keeps every test of a criterion meaningful.
For a finding titled "Incomplete fix: …": confirm the prior finding and its fix, and judge whether the code at head really leaves that fix incomplete.

One finding at a time: take one, investigate it fully, give its verdict, then take the next. Never read code for several findings at once or judge them as a batch.
Do not edit any file except the output file. Report the output path and the counts.
