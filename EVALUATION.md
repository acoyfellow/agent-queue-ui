# Prompt-routing evaluation protocol

## Scenario suite

| Scenario | Controlled input | Reveals |
| --- | --- | --- |
| Clean arrival | Four people submit once in known order | Baseline order and concurrency |
| One loud participant | One person submits four times before others | Queue capture, identity fairness, grouping |
| Mid-flight correction | A participant revises an active prompt | Supersession, cancellation, wasted work |
| Host interruption | The facilitator adds an urgent request during active work | Role priority and interruption semantics |
| Quick and deep work | Prompt effort varies while arrival order stays fixed | Effort-aware routing and starvation |
| Dependent chain | Two prompts require an earlier answer | Dependency visibility and invalid parallelism |
| Contradictory intent | Two people request incompatible outcomes | Conflict detection, joining, and escalation |
| Late arrival | New work appears while a wave or batch is active | Admission boundaries and predictability |
| Returning participant | Service history is seeded before new requests | Long-horizon fairness |
| Overload | Twenty requests arrive in a short burst | Backpressure, comprehension, and recovery |

## Event trace

Every run should eventually record:

- prompt submitted, edited, withdrawn, merged, split, or superseded;
- prompt admitted, blocked, activated, interrupted, resumed, and completed;
- routing pattern and configuration at each decision;
- decision reason visible to the participant;
- active and waiting counts;
- participant identity, role, and prior service count;
- timestamps and dependency relationships;
- participant predictions and interventions.

## Derived measures

### Performance

- Time to first activation
- Median and tail wait
- Room makespan
- Active-capacity utilization
- Work discarded after interruption or supersession

### Fairness

- Attention share by participant
- Maximum consecutive turns for one participant
- Oldest-request age
- Starvation incidents
- Role-priority displacement

### Comprehension

- Accuracy when predicting the next active prompt
- Time to locate personal work
- Time to explain why a prompt moved
- Number of visible states scanned
- Routing-surprise count

### Agency and trust

- Successful redirects, cancellations, and joins
- Interventions needed to repair routing
- Perceived fairness
- Confidence in the next predicted action
- Agreement between displayed rationale and observed behavior

## Comparison rule

A new pattern enters the atlas only when it names a disambiguating scenario and predicts an observable difference from existing patterns. A visual variation may remain as a presentation treatment, but it is not counted as a routing mechanism.

Avoid a universal leaderboard. Report a profile across performance, fairness, comprehension, agency, and trust. Advance a pattern only for the contexts where its profile is useful.
