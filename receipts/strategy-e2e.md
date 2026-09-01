# Twenty-strategy E2E receipt

- Outcome: observed
- Surface: cmux browser rendering `http://127.0.0.1:5174/`
- Test mode: `?e2e=1&strategy=<id>` shortens Effect durations without changing admission or ordering
- Raw results: `strategy-e2e.tsv`

## Observed

All 20 strategies rendered, admitted three seeded requests, completed all three, and produced exactly three deterministic `Ok` responses.

Peak active work matched configured Effect parallelism:

- concurrency 1 strategies peaked at 1;
- bounded pair strategies peaked at 2;
- bounded trio and three-item burst strategies peaked at 3;
- batch barriers completed all work without duplicate responses.

Ordering differences were observed for newest-first, shortest-first, longest-first, deterministic shuffle, and newest-per-person. The remaining fairness strategies need repeated-author and completion-history scenarios for stronger behavioral evidence.

## Not proven

Automation proves state transitions, completion, ordering, and concurrency bounds. It does not prove which strategy feels understandable, fair, calm, or trustworthy to people in a shared room.
