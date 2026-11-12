# Security review

Find exploitable weaknesses the change introduces or leaves on a path it reaches. A finding names
three things: the untrusted input, the path it travels to a dangerous operation, and what an
attacker gains. Without all three it is a hypothesis, not a finding.

## Read first

- The project's rules file and any security or trust-boundary document it links.
- The project's helpers for running commands, HTTP and file writes, when the change uses them.

## Trust boundaries

Usually untrusted:

- output of models and remote agents: messages, tool calls and their arguments, file paths, diffs,
  commands;
- the content of a project or repository the user opened: file names, configuration, scripts. A
  cloned repository can be hostile;
- files on disk that another process can write;
- anything a remote endpoint returns.

The user acting on purpose through the UI is not an attacker.

## What to look for

- **Removed protection.** A validation, permission check, containment check or narrowed guard the
  diff removes. The most often missed security regression.
- **Command execution.** Arguments passed as a vector, never joined into a shell string. A path or
  name from an untrusted source in a command line. The environment passed to the process.
- **Path containment.** A string prefix check does not respect path segments (`/rootevil` passes
  for `/root`). Compare normalised paths after resolving `..` and symlinks. Writes outside the
  allowed roots.
- **Permissions.** An action from an untrusted source that skips the permission flow, or an "allow
  always" that grants more than the user chose.
- **A prompt is not a boundary.** A rule stated only in prompt or tool description text and not
  enforced in code.
- **Hostile structured input.** Every field of an external message can be absent, of the wrong
  type, oversized, or point anywhere. Parse at the boundary; do not trust it at first use.
- **Downloads.** HTTPS required, the source fixed by configuration, the file written atomically
  with safe permissions, nothing runs a partly written file.
- **Credentials.** Tokens and keys in logs, exception messages, analytics payloads, `toString()`
  of a data type, or persisted records. Tokens written non-atomically or with broad file modes. TLS
  verification disabled. A token kept longer than needed.
- **Outbound links.** A URL built from untrusted text and opened in the browser.
- **Resource exhaustion** only where the input is truly untrusted and no limit exists.

## Boundaries

- Generic hardening advice with no traced path from an untrusted input is not a finding.
- Threats that need the attacker to control the user's machine already are out of scope.
- Vulnerable dependency versions belong to a dependency scanner.
- Defensive code at a trust boundary is correct; do not call it slop.
- A behaviour bug with no attacker: correctness. A lifetime or race bug with no attacker:
  concurrency.
