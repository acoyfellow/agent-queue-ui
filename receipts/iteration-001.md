# Iteration 001 receipt

- Outcome: observed
- Artifact: `experiments/iteration-001/`
- URL: `http://127.0.0.1:5174/`
- Screenshot: `iteration-001.png`

## Observed

- The app renders as a full-screen shared conversation with the queue inline in the transcript.
- Sending `Can everyone see my place in line?` as Maya creates one active queue item with Maya's identity and prompt.
- The active state is visible beside the conversation rather than in a separate sidebar.
- The queue strategy selector drives real Effect v4 sequential, bounded-two, and unbounded `Effect.forEach` concurrency.
- The frontend appends the deterministic agent response `Ok` and clears the queue item.
- `bun run check` reports zero errors and warnings.
- `bun run build` completes successfully.

## Not proven

The five-second comprehension claim requires a human observation. Rendering and deterministic state transitions do not prove that the queue is understandable.
