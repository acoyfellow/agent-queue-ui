# Iteration 001: side queue

A full-screen shared agent chat with the agent's active turn and pending queue in a persistent right rail.

## Test

1. Open the app.
2. Identify the active request and the next request.
3. Switch participant and send a message.
4. Watch it move from queued to active to answered.
5. Decide whether the queue is understandable without reading the full transcript.

The agent deterministically returns `Ok`. Refresh resets the experiment.
