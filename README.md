# Agent Queue UI

Many people talking to one agent quickly becomes ambiguous: nobody knows whose turn is next, what the agent is handling, or whether a message was lost.

**Bet:** a shared full-screen chat can make one agent's active turn and pending human queue understandable without turning conversation into a ticket tracker.

## Falsifiable claim

A participant can identify what the agent is handling now, what is next, and where their own message sits within five seconds of opening the UI.

## Run iteration 1

```sh
bun install
bun run dev
```

Open <http://localhost:5174>.

Send a message as any participant. The frontend queues it, promotes it to active work, and returns `Ok`. There is no backend or model.

## Notebook

- `status.json` is the claim ledger.
- `experiments/iteration-001/` is the runnable Svelte experiment.
- `receipts/` contains the pre-build receipt-schema review.
- `findings.md` records what each iteration teaches us.

## Limits

This experiment has no authentication, persistence, networking, model, or production authority. Refreshing resets everything. Queue timing is simulated.

## What this makes possible next

The stable message and queue vocabulary lets later iterations compare alternate queue presentations without rebuilding the chat substrate.