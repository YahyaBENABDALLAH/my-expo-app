# Documentation ownership

Use [the central index](index.md) to find maintained project documentation.
Each topic has one canonical owner.

| Material                                        | Owner                                                       |
| ----------------------------------------------- | ----------------------------------------------------------- |
| Project introduction and quick start            | Root `README.md`                                            |
| Project rules and skill routing                 | `AGENTS.md`                                                 |
| Human-facing architecture, setup and operations | Focused guides in `docs/`                                   |
| Component contract and native composition       | Matching `.agents/skills/foodiya-ui-*/SKILL.md`             |
| Detailed page/button guidance or long examples  | That skill’s linked `references/`                           |
| Shared native layout and theme rules            | Existing Expo mobile and component-library skills           |
| Historical findings and device observations     | Dated reports; the UI catalog history is in `docs/archive/` |

## Maintain one source

Update a component’s existing skill when its props, Host ownership, theme roles
or platform behavior change. Keep source links and available native story paths
accurate. Link to shared rules instead of repeating them in every skill.
Do not add a README to a component, source or asset folder.

Keep skill descriptions specific enough for discovery. Read the relevant skill
first, then only the references needed for the task. Short component guides live
directly in `SKILL.md`; the longer page and button guides use references.
Do not create another skill when the existing family already owns the behavior.

Reports record the state when they were written. They may mention retired tests,
fixtures or older APIs; they do not override current source, package scripts,
AGENTS.md or canonical component skills.

## Check a documentation change

Check local links after moving material, format edited Markdown, and validate
changed skill metadata. Run the current lint and typecheck commands required by
AGENTS.md. Do not claim native execution from documentation or registration.

This layout follows Codex’s [skill guidance](https://github.com/openai/codex/blob/main/codex-rs/skills/src/assets/samples/skill-creator/SKILL.md)
on concise entry points and progressive disclosure, checked with Context7.
