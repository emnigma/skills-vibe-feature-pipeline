---
name: review-ponytail
returns:
  output: string
  findings: integer
---
Read the `ponytail-review` skill and follow it, with the output format and severity scale of the `fp-code-review` reviewer rules (`roles/README.md`): one finding per defect, with path:line and a concrete fix.

Role name: ponytail. Focus: is every line needed for the capabilities in the packet's "Review focus". Find infrastructure, abstractions, states, parameters, test machinery or fixtures with one user, code left over from removed or reverted parts, and code that could reuse what the base branch already has. For each, give the lines it would save. Do not propose cutting behaviour the spec __SPEC__ requires, or anything the decision log keeps: __KEPT_BY_DECISION__.

Checkout: __CHECKOUT__ at head __HEAD__. Base __BASE__.
Packet: {{dir}}/PACKET.md. Pinned diff: {{dir}}/scope.diff (ignore scratch paths, which do not ship).

Do not edit any file except your output file, and do not run builds or tests.
Write the artifact to {{output}}. Report `output` = that path and `findings` = the number of findings.
