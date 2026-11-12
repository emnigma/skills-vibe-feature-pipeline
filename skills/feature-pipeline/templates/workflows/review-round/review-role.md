---
name: review-role
returns:
  output: string
  findings: integer
---
Read the reviewer rules of the `fp-code-review` skill (`roles/README.md`) and the role file for {{role}} (a file in its `roles/` folder, or the project role file named in the packet's routing), and follow them.

Checkout: __CHECKOUT__ at head __HEAD__. Base __BASE__.
Packet: {{dir}}/PACKET.md. Pinned diff: {{dir}}/scope.diff.

Files of this pass: {{files}}. Other passes of the same role cover: {{others}}. Read them only as context.
Read the "Review focus" section of the packet. Report only defects this branch introduces or leaves behind. Before reporting a behaviour defect, check whether the base branch behaves the same (`git show __BASE_BRANCH__:<path>`); if it does, it is out of scope — do not report it.

Do not edit any file except your output file, and do not run builds or tests.
Write your full artifact, in the format of roles/README.md, to {{output}}.
Report `output` = that path and `findings` = the number of findings in it (0 for "no findings" or "not_applicable").
