# Queue strategy map

The strategy selector drives both Effect v4 scheduling and the inline queue treatment. Every strategy keeps the same conversation and deterministic `Ok` response so differences come from admission, ordering, concurrency, pacing, and presentation.

| Strategy | Mechanism | Good for | Tradeoff | Visible difference |
| --- | --- | --- | --- | --- |
| First in, first out | Arrival order, concurrency 1 | Predictable social contracts | Slow work blocks the room | Stable numbered line |
| Newest first | Reverse arrival order, concurrency 1 | Incident-room corrections | Old work can starve | Stack-like entry |
| Quick wins | Shortest prompt first, concurrency 1 | Shrinking queue length | Complex work waits | Compact fast-moving line |
| Deep work first | Longest prompt first, concurrency 1 | Protecting substantial requests | Small asks feel delayed | Deliberate low-motion line |
| Host priority | Maya first, concurrency 1 | Facilitated sessions | Unequal room authority | Host jumps the line |
| Round robin | Interleave identities, concurrency 1 | Balanced participation | Urgency is secondary | Person-to-person rotation |
| Least recently served | Completion-history priority, concurrency 1 | Long-running fairness | Harder to predict | Service history changes order |
| Participant blocks | Group requests by identity | Preserving one train of thought | Others wait through a block | Visually stacked identity block |
| Parallel pair | FIFO, Effect concurrency 2 | Throughput with legibility | Responses can reorder | Two active lanes |
| Parallel trio | FIFO, Effect concurrency 3 | Busy independent work | More scanning cost | Three active cells |
| Parallel burst | FIFO, unbounded Effect concurrency | Minimum independent-task latency | No backpressure | Every request activates together |
| Pairs in waves | Batch 2, concurrency 2 | Comparing paired work | Fast lane waits at barrier | Two-item wave marker |
| Room waves | Batch 4, concurrency 4 | Periodic room synthesis | New arrivals wait for next wave | Whole-room wave block |
| One per person | Identity-diverse batch, unbounded | Preventing queue capture | Follow-ups are deferred | One active cell per identity |
| Quick-win pair | Shortest first, concurrency 2 | Fast visible progress | Long work can starve | Two compact fast lanes |
| Host plus one | Host priority, concurrency 2 | Facilitation plus participation | Host consumes half capacity | Paired host/room lanes |
| Adaptive pressure | One lane when quiet, three under load | Calm idle state and fast spike drain | Capacity changes under users | Lane count follows pressure |
| Visible lottery | Deterministic shuffled order, concurrency 1 | Low-stakes ideation | No urgency semantics | Pop animation and shuffled line |
| Freshest per person | Latest request per identity first, concurrency 2 | Frequent self-correction | Earlier context moves back | Two recency-driven lanes |
| Calm drain | FIFO, concurrency 1, slower pacing | Low-distraction rooms | Feels slow under pressure | Compact layout with no entry motion |

## Dimensions exposed

- **Ordering:** arrival, recency, prompt size, role, identity rotation, service history, affinity, deterministic shuffle.
- **Admission:** continuous lanes, fixed waves, identity-diverse waves, adaptive capacity.
- **Parallelism:** Effect v4 `Effect.forEach` with concurrency `1`, bounded `2–4`, or `unbounded`.
- **Pacing:** quick, standard, deep-work, or calm durations.
- **Presentation:** line, stack, lanes, grid, wave, or compact layout with slide, fade, pop, stagger, pulse, or no motion.

The strategies are experiments, not recommendations. Fairness, comprehension, interruption cost, starvation, and trust need human observation before any policy is promoted.
