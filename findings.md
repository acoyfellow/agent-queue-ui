# Findings

## Iteration 1

The first queue rail competed with the conversation and made the queue feel like a separate product surface. It was removed.

The queue now appears inline at the point where the agent is working. A compact selector beside the composer switches between Effect v4 `Effect.forEach` concurrency modes: sequential, bounded to two fibers, and unbounded. Each mode changes both scheduling and the inline active-turn layout.

The visual pass follows the Kumo design skill: 14px content, sentence case, unchanged tracking, semibold rather than bold, borders without shadows, and tighter grouping of related text.

The five-second comprehension claim still needs hands-on review.
