# Prompt-routing pattern discovery brief

Design and investigate a visual prompt-routing layer for a shared space where several people direct work toward one agent.

The purpose is not to produce cosmetic variations on a queue. Search for distinct interaction models that change how intent is interpreted, admitted, combined, ordered, delegated, interrupted, resumed, and made legible to the room. Favor patterns that expose a meaningful product hypothesis and could fail in an informative way.

## Discovery mandate

Generate routing patterns across several behavioral dimensions:

- who or what receives attention;
- when a prompt becomes eligible for work;
- whether related prompts remain separate, merge, branch, or supersede one another;
- how urgency, role, age, effort, dependencies, and participant history affect routing;
- whether work advances continuously, in bounded lanes, in waves, or through explicit gates;
- how people redirect, cancel, defer, endorse, challenge, or join existing intent;
- what context the agent sees and what routing rationale the room sees;
- how the system behaves when information is incomplete, contradictory, or rapidly changing.

Do not assume that arrival order, a visible line, or one prompt producing one response is correct. Include calm, adversarial, collaborative, overloaded, and ambiguous situations. Preserve strange but coherent ideas when they reveal a new design axis.

## Pattern contract

For every proposed pattern, define:

1. **Mechanism** — the exact admission, ordering, grouping, and completion rules.
2. **User hypothesis** — what participants should understand or be able to do better.
3. **Visible model** — how active, waiting, merged, blocked, and completed intent appears.
4. **Control surface** — what participants can influence and what remains automatic.
5. **Failure mode** — how the pattern can become unfair, confusing, slow, gameable, or unsafe.
6. **Disambiguating scenario** — the smallest scenario that makes it behave differently from nearby patterns.
7. **Signals** — observable events and derived measures that could support or reject the hypothesis.
8. **Exit criterion** — what evidence would justify discarding, revising, or advancing the pattern.

A pattern is not distinct merely because it has a different name, animation, or concurrency number. Its rules must produce a different decision, participant action, or explanation under at least one controlled scenario.

## Experimental method

Keep agent output deterministic so routing remains the independent variable. Run every viable pattern against the same scenario suite, then add the pattern’s disambiguating scenario. Capture event traces rather than relying only on screenshots.

Compare patterns on separate dimensions instead of collapsing them into one score:

- time until a participant can identify what is active and why;
- time to first work and time to complete the room;
- oldest-request wait and starvation risk;
- participant share of attention;
- number of order surprises and routing reversals;
- amount of duplicated or superseded work;
- frequency and cost of manual intervention;
- accuracy of participant predictions about what happens next;
- perceived fairness, agency, calmness, and trust;
- explanation burden and visual scanning cost.

Record negative and ambiguous evidence. Do not recommend a winner until the scenarios reveal which contexts require different routing policies.

## Desired output

Produce a growing pattern atlas rather than a single preferred design. Organize it by underlying mechanism, identify equivalent patterns disguised by presentation, map meaningful hybrids, and call out unexplored regions. For each implemented pattern, provide a runnable comparison, event-level evidence, observed differences, unresolved questions, and the next most informative experiment.
