# Findings

## Iteration 1

The first queue rail competed with the conversation and made the queue feel like a separate product surface. It was removed.

The queue now appears inline at the point where the agent is working. A compact selector beside the composer switches between Effect v4 `Effect.forEach` concurrency modes: sequential, bounded to two fibers, and unbounded. Each mode changes both scheduling and the inline active-turn layout.

The visual pass follows the Kumo design skill: 14px content, sentence case, unchanged tracking, semibold rather than bold, borders without shadows, and tighter grouping of related text.

The five-second comprehension claim still needs hands-on review.

## Iteration 2

Twenty policies now expose five independent design dimensions: order, fairness, parallelism, admission barriers, and pacing. Keeping the response fixed at `Ok` makes scheduler behavior the primary variable.

The most legible differences in automation are strict order reversals and lane count. FIFO, LIFO, shortest-first, longest-first, shuffle, and newest-per-person produce visibly different completion sequences. Sequential, bounded pair, bounded trio, and burst modes produce the expected peak active counts.

Several policies intentionally share a completion order in the three-person seed. Their difference only appears with repeated authors, role-bearing requests, completion history, or arrivals during an active batch. Those scenarios are the next useful E2E expansion; presenting them as proven differences would overstate the current receipt.

The inline good-for, tradeoff, and difference labels make the catalog explorable without a sidebar, but they also increase density. Human testing should determine whether these labels belong inline, behind an info action, or only in the written strategy map.
