# Visual Prompt Routing Lab

When several people direct one agent, the product must decide more than who is next. It must interpret how prompts relate, decide when work is eligible, allocate attention, expose its reasoning, and let the room intervene.

This notebook investigates that prompt-routing layer through runnable visual patterns. Agent output remains the deterministic response `Ok`, keeping routing behavior as the independent variable.

## Falsifiable claim

A participant can identify what the agent is handling, why it was selected, what is likely to happen next, and where their own intent sits within five seconds.

## Run the lab

```sh
bun install
bun run dev
```

Open <http://localhost:5174>. Send a prompt as any participant or select another routing pattern. Empty runs receive a fresh controlled sample.

## Research materials

- `RESEARCH_PROMPT.md` is the reusable pattern-discovery brief.
- `EVALUATION.md` defines scenarios, event traces, and measurable dimensions.
- `STRATEGIES.md` maps the first 20 implemented patterns.
- `status.json` separates proven, unproven, and disproven claims.
- `experiments/iteration-001/` contains the runnable Svelte experiment.
- `receipts/` contains validation evidence and raw E2E observations.
- `findings.md` records what each iteration teaches us.

## Limits

This experiment has no authentication, persistence, networking, model, or production authority. Refreshing resets everything. Timing is simulated. The current E2E evidence proves scheduling behavior, not human comprehension, fairness, or trust.

## Next research boundary

The initial catalog is strongest at ordering, batching, and concurrency. The next experiments should investigate semantic routing: corrections that supersede prior intent, prompts that merge or branch, dependencies that prevent unsafe parallelism, contradictory requests, participant intervention, and visible routing explanations.
