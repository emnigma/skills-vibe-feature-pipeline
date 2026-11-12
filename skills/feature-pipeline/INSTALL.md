# Building the project profile

Run this when the project has no `feature-pipeline.md` in the agent's configuration folder. The
result is a draft that the owner approves before the pipeline starts. The format is in
`profile-schema.md`.

## 1. Find the configuration folder

Use the folder the agent reads in this project (for example `.explyt/` or `.veai/`). If several
exist, ask the owner which one.

## 2. Fill each slot

Look for real evidence for every slot. Leave a slot empty rather than guess.

| Slot | Where to look |
|---|---|
| `rules-file` | `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `.cursor/rules`, rule folders of the agent |
| `checks` | CI workflows (`.github/workflows`, `.gitlab-ci.yml`, others), the build tool's check tasks, linters, scripts the rules file names |
| `pr-budget` | a PR size check in CI or in a scripts folder, and its limits; otherwise leave it empty and let the PM set a budget per feature |
| `pr-layout` | the rules file, recent merged PRs (`gh pr list --state merged`): one PR, or spec first and stacked code, merge or squash |
| `paths.specs`, `paths.exec-plans` | folders with specs, plans or design docs and their templates |
| `paths.scratch` | a git-ignored folder for reports and packets; propose one if none exists and add it to `.gitignore` only with the owner's yes |
| `issue-templates` | `.github/ISSUE_TEMPLATE`, labels in use |
| `humanize-skill`, `architecture-guides`, `coding-guides`, `test-guides`, `review-roles`, `demo-skill` | the skill roots of the project and of the user; match by each skill's `description`, never by its name alone |
| `language-with-owner` | the language the owner writes in |

For skills, list every skill in the project and global roots, read each description, and map a
skill to a slot only when its description fits the slot's purpose. Name the evidence for every
mapping in the draft.

## 3. Show and approve

Write the draft to the configuration folder, show the owner a short table (slot, value, evidence,
empty slots), and apply the owner's corrections. The pipeline starts only after the owner's yes.

## 4. Keep it current

When a run finds a slot that no longer matches the environment (a skill was renamed, a command
moved), stop, propose the fix to the profile, and continue after the owner's yes.
