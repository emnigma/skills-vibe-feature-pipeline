# Concurrency review

Find defects in async code, streams, lifetimes, threads and external processes: work that outlives
its owner, cancellation that is lost, races on shared state, blocking on the wrong thread, and
threading contracts lost when code moves.

## Read first

- The lifetime and threading rules of the project: the rules file, and the design documents of the
  modules the change touches.
- The project's helper for running external processes, when the change runs one.

## What to look for

### Scope ownership

- Every task runs in a scope with a clear owner that ends. A new scope or executor that nobody
  cancels or shuts down is a leak.
- A scope or job created in a constructor with no matching cancellation when the owner ends.
- Work started in a wider scope than its owner keeps running after the owner is gone.
- A listener or subscription registered with no unregistration tied to the owner's lifetime.

### Cancellation

- A broad `catch` around async code that swallows the cancellation signal. Rethrow it, or catch a
  narrower type.
- Cleanup that calls async code which cannot run once the task is cancelled.
- A cancelled operation that leaves a status in its in-progress step, or reports success.
- A timeout that cancels the waiting side but not the work, or the reverse.

### Threads and blocking

- Blocking I/O, sleeps, process waits or blocking locks on a thread or dispatcher that must not
  block.
- Bridging async code back to blocking code in production paths.
- Work that must run on the UI thread off it, or long work on the UI thread.

### Threading contract lost in a move

When the change moves code between modules, layers or classes, check for each moved call that its
thread, dispatcher, lock or scope is the same at the new place. The old wrapper is often not in the
diff: read the old caller.

### Shared state and streams

- Mutable state read and written from several tasks without a lock, an atomic, or a single owner.
  Check-then-act on shared state instead of an atomic update.
- A conflated state stream where every value matters (events, records); a stream without replay
  where a late subscriber needs the last value.
- A queue or channel with an unbounded buffer on untrusted input, or a send that can block forever
  after the consumer is gone.
- Order: an event emitted before the state it describes is visible.
- A gate or lock taken in one place and released in another with a path between them that skips
  the release (an early return, a closed view, a failure).

### External processes

- A process started without a guaranteed end: its descendants stopped, its streams drained so it
  cannot block on a full pipe, and its wait bounded.

## Boundaries

- Documented invariants as such: architecture. Report here only the concurrency mechanism that
  breaks them.
- An exploitable process or path issue: security. A plain logic bug: correctness.
