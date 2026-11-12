# Size audit prompt

Give this to an independent read-only subagent, with the placeholders filled.

---

Read-only investigation, no edits. Repository: <checkout>. Read <rules-file> first.

The change on <branch> (measure `git diff <base-branch>...<head>`, without <scratch paths>) looks
too big for what it delivers. Its capabilities: <one line each>. Current size: production <N>,
tests <N>, spec <N>. Budget from the scope contract: <N> / <N> / <N>.

1. Pick 3–5 comparable merged changes from the project history. For each: user-visible scope in one
   line, production, test and spec lines, number of files.
2. Normalise to lines per user-visible capability. Note whether each comparable built its feature
   from nothing or extended existing behaviour.
3. Break down where this change's lines go, by file group and by capability. Name the top 5 causes
   of excess with their lines, and for each say whether a capability in scope requires it or it was
   added along the way (review fixes, defensive states, accessibility or keyboard extras, custom
   infrastructure, a neighbouring bug, documentation growth).
4. Say what a lean implementation of the same capabilities would plausibly cost.

Write the report to <scratch>/<feature>-size/REPORT.md and reply with at most 15 lines.
