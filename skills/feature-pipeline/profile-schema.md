# Profile format

The profile is `feature-pipeline.md` in the configuration folder the agent reads in the project
(`<config>/feature-pipeline.md`). It is committed with
the project, so the project's specifics stay in the project. YAML front matter holds the slots;
the Markdown body may add free-form notes for the roles.

## Slots

| Slot | Required | Meaning |
|---|---|---|
| `rules-file` | yes | The project rules every role reads first. |
| `checks` | yes | Commands that must pass before a commit and before a PR. |
| `pr-budget` | no | `{product, other, check}`: line limits and the command that checks them. Empty: the PM sets a budget per feature. |
| `pr-layout` | yes | How the work becomes PRs, for example `single`, or `spec-then-code` (a spec PR and a code PR stacked on it). |
| `paths.specs` | yes | Where specs live, with the template if there is one. |
| `paths.exec-plans` | no | Where plans and design notes live. |
| `paths.scratch` | yes | A git-ignored folder for reports, packets and formal models. Never committed. |
| `issue-templates` | no | Issue templates and labels for out-of-scope bugs. |
| `humanize-skill` | no | A skill that rewrites spec prose in plain language. |
| `architecture-guides` | no | Skills or docs the architect and designer follow. |
| `coding-guides` | no | Skills or docs the coder follows. |
| `test-guides` | no | Skills or docs QA follows. |
| `review-roles` | no | Extra reviewer role files for `fp-code-review`, with their triggers. |
| `demo-skill` | no | A skill that records demo videos of the feature. |
| `language-with-owner` | no | The language for talk with the owner. Default: the owner's language. |

## Example

```markdown
---
rules-file: AGENTS.md
checks:
  - ./gradlew check
  - ./scripts/lint-docs.sh
pr-budget:
  product: 1500
  other: 2500
  check: ./scripts/pr-size.sh {product} {other} {base}
pr-layout: spec-then-code
paths:
  specs: docs/specs/<issue>-<slug>/spec.md (template docs/specs/_TEMPLATE.md)
  exec-plans: docs/plans/
  scratch: .tasks/
issue-templates: .github/ISSUE_TEMPLATE/bug.yml
humanize-skill: plain-english
architecture-guides: [ui-guidelines, ports-and-adapters]
coding-guides: [ui-guidelines]
test-guides: []
review-roles:
  - file: .agents/review-roles/ui.md
    trigger: UI code, view models, UI tests
  - file: .agents/review-roles/invariants.md
    trigger: the core modules listed in the rules file
demo-skill: screen-demo
language-with-owner: English
---

Notes for the roles: the UI module must not depend on the IDE module.
```
