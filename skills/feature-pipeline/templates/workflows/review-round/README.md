# Review round workflow template

Plugins cannot ship workflows, so the orchestrator copies this folder into the project's temporary
workflow folder (`<config>/tmp-workflows/<feature>-review-r<N>/`), replaces the
placeholders, runs `check_workflow` on the folder, fixes every problem, and runs it with
`run_workflow`.

Before the run, pin the scope yourself:

```sh
mkdir -p <scratch>/<feature>-review-r<N>
git diff <base>..<head> -- . ':(exclude)<scratch paths>' > <scratch>/<feature>-review-r<N>/scope.diff
git diff --name-only <base>..<head> -- <production globs> > <scratch>/<feature>-review-r<N>/significant.txt
```

## Placeholders

| Placeholder | Value |
|---|---|
| `__NAME__` | a unique workflow name, for example `<feature>-review-r<N>` |
| `__FEATURE__`, `__ROUND__` | the feature label and the round number |
| `__SCRATCH__` | the profile's `paths.scratch` |
| `__CHECKOUT__`, `__BRANCH__`, `__HEAD__`, `__BASE__`, `__BASE_BRANCH__` | the checkout path, the branch, the full head and base SHAs, the base branch (for example `origin/main`) |
| `__SPEC__`, `__DECISION_LOG__` | paths to the spec and the decision log |
| `__CAPABILITIES__` | one line per capability under review |
| `__CHANGED_SINCE_LAST__` | what the fixes since the previous round did |
| `__GROUPING_RULE__` | how to group the files, for example by module |
| `__ROUTING__` | the roles run and skipped, by the `fp-code-review` routing and the profile's `review-roles` |
| `__SPLIT_OUT__`, `__ACCEPTED__`, `__KEPT_BY_DECISION__` | issues split out of scope; known and accepted items; what the decision log keeps |
| `__GROUPS__` | `E: "E — <group> (files of group E in PACKET.md)",` one line per group |
| `__PASSES__` | `{ role: "correctness", pass: "E", others: "C, U" },` one line per role and pass |

A pass takes at most 15 significant files. Run at most 10 reviewers at once; the workflow engine
batches the rest.
