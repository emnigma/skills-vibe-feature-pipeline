---
name: write-report
returns:
  tp: integer
  fp: integer
  needMoreData: integer
  outOfScope: integer
  incompleteFixes: integer
  aboveLow: integer
  summary: string
---
You write the final report of a review round, by the report section of the `fp-code-review` skill (read its SKILL.md).

Packet: {{dir}}/PACKET.md. Read every reviewer artifact: {{reviews}}
and every validation artifact: {{validations}}
A reviewer artifact with findings but no validation artifact means its validation failed: list its findings under "Need more data" with that reason.

Take the TP findings, merge duplicates across roles and passes (keep every source role), and write {{dir}}/REPORT.md in the report format of the skill. Include the orchestrator check result from the packet.
List the findings dropped as "out of scope: exists on the base branch" in a short separate section (title and one-line reason each); count them as `outOfScope`. The orchestrator turns each into a separate issue.

Add a section "Stop decision". Count `incompleteFixes` = confirmed findings that leave a fix of an earlier round incomplete, and `aboveLow` = confirmed findings with severity medium, high or critical. State "STOP — go to the size audit" when both are 0, otherwise "CONTINUE", with the reason.
Add a section "Step-back check": the areas (module or file group) of the confirmed findings, and whether any area also had confirmed findings in the previous round, or whether any finding repairs a fix of an earlier round. If so, write "STEP BACK: <area>".
Replace the "Validation decision" section of PACKET.md with the decision taken.

Do not edit any other file. Report the counts and in `summary` the stop decision and the step-back result first, then the confirmed findings, highest severity first, one line each: severity — title — path:line — fix; then NeedMoreData titles.
