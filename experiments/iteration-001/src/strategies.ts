import type { Parallelism } from './queueRuntime';

export type StrategyId =
  | 'fifo'
  | 'lifo'
  | 'shortest'
  | 'longest'
  | 'host-first'
  | 'round-robin'
  | 'least-recent'
  | 'participant-blocks'
  | 'parallel-pair'
  | 'parallel-trio'
  | 'parallel-burst'
  | 'wave-two'
  | 'wave-four'
  | 'fair-wave'
  | 'quick-pair'
  | 'host-plus-one'
  | 'adaptive'
  | 'shuffle'
  | 'newest-per-person'
  | 'calm-drain';

export type StrategyCategory = 'Order' | 'Fairness' | 'Parallelism' | 'Batching' | 'Adaptive';
export type StrategyLayout = 'line' | 'stack' | 'lanes' | 'grid' | 'wave' | 'compact';
export type StrategyAnimation = 'slide' | 'fade' | 'pop' | 'stagger' | 'pulse' | 'none';
export type StrategyOrder =
  | 'fifo'
  | 'lifo'
  | 'shortest'
  | 'longest'
  | 'host-first'
  | 'round-robin'
  | 'least-recent'
  | 'participant-blocks'
  | 'shuffle'
  | 'newest-per-person';

export type Strategy = {
  id: StrategyId;
  category: StrategyCategory;
  label: string;
  summary: string;
  goodFor: string;
  tradeoff: string;
  difference: string;
  concurrency: Parallelism;
  batchSize?: number;
  order: StrategyOrder;
  layout: StrategyLayout;
  animation: StrategyAnimation;
  durationMs: number;
};

export type PlannableTurn = {
  id: string;
  authorId: string;
  prompt: string;
};

export const strategies: Strategy[] = [
  {
    id: 'fifo',
    category: 'Order',
    label: 'First in, first out',
    summary: 'One request at a time, in arrival order',
    goodFor: 'Predictability and visible social contracts',
    tradeoff: 'A slow request blocks everything behind it',
    difference: 'Strict queue position never changes',
    concurrency: 1,
    order: 'fifo',
    layout: 'line',
    animation: 'slide',
    durationMs: 5000,
  },
  {
    id: 'lifo',
    category: 'Order',
    label: 'Newest first',
    summary: 'The most recent request gets attention next',
    goodFor: 'Fast-moving incident rooms',
    tradeoff: 'Older requests can starve',
    difference: 'The queue behaves like a stack',
    concurrency: 1,
    order: 'lifo',
    layout: 'stack',
    animation: 'pop',
    durationMs: 4200,
  },
  {
    id: 'shortest',
    category: 'Order',
    label: 'Quick wins',
    summary: 'Short prompts are handled before longer ones',
    goodFor: 'Reducing visible queue length quickly',
    tradeoff: 'Complex work waits longer',
    difference: 'Prompt length determines position',
    concurrency: 1,
    order: 'shortest',
    layout: 'compact',
    animation: 'fade',
    durationMs: 3000,
  },
  {
    id: 'longest',
    category: 'Order',
    label: 'Deep work first',
    summary: 'The largest request claims the agent first',
    goodFor: 'Protecting substantial work from interruption',
    tradeoff: 'Small requests feel unnecessarily delayed',
    difference: 'Long prompts move to the front',
    concurrency: 1,
    order: 'longest',
    layout: 'line',
    animation: 'fade',
    durationMs: 6500,
  },
  {
    id: 'host-first',
    category: 'Order',
    label: 'Host priority',
    summary: 'Maya’s requests move ahead of the room',
    goodFor: 'Facilitated sessions with one accountable driver',
    tradeoff: 'The room is visibly unequal',
    difference: 'Role outranks arrival time',
    concurrency: 1,
    order: 'host-first',
    layout: 'line',
    animation: 'slide',
    durationMs: 5000,
  },
  {
    id: 'round-robin',
    category: 'Fairness',
    label: 'Round robin',
    summary: 'The agent rotates between people',
    goodFor: 'Balanced participation in a shared room',
    tradeoff: 'Urgency and arrival order become secondary',
    difference: 'No person gets a second turn before others',
    concurrency: 1,
    order: 'round-robin',
    layout: 'line',
    animation: 'stagger',
    durationMs: 4800,
  },
  {
    id: 'least-recent',
    category: 'Fairness',
    label: 'Least recently served',
    summary: 'People who have waited longest get priority',
    goodFor: 'Long-running rooms with uneven participation',
    tradeoff: 'The ordering is harder to predict locally',
    difference: 'Prior completions influence the next turn',
    concurrency: 1,
    order: 'least-recent',
    layout: 'line',
    animation: 'fade',
    durationMs: 4800,
  },
  {
    id: 'participant-blocks',
    category: 'Fairness',
    label: 'Participant blocks',
    summary: 'One person’s adjacent requests stay together',
    goodFor: 'Preserving a person’s train of thought',
    tradeoff: 'Other people wait through the whole block',
    difference: 'Identity affinity outranks strict arrival order',
    concurrency: 1,
    order: 'participant-blocks',
    layout: 'stack',
    animation: 'slide',
    durationMs: 4500,
  },
  {
    id: 'parallel-pair',
    category: 'Parallelism',
    label: 'Parallel pair',
    summary: 'Two requests advance whenever lanes are free',
    goodFor: 'Visible throughput without losing all focus',
    tradeoff: 'Responses may arrive out of order',
    difference: 'Bounded Effect concurrency of two',
    concurrency: 2,
    order: 'fifo',
    layout: 'lanes',
    animation: 'slide',
    durationMs: 5000,
  },
  {
    id: 'parallel-trio',
    category: 'Parallelism',
    label: 'Parallel trio',
    summary: 'Three requests advance at once',
    goodFor: 'Busy rooms with independent questions',
    tradeoff: 'Attention becomes harder to scan',
    difference: 'Bounded Effect concurrency of three',
    concurrency: 3,
    order: 'fifo',
    layout: 'grid',
    animation: 'stagger',
    durationMs: 5000,
  },
  {
    id: 'parallel-burst',
    category: 'Parallelism',
    label: 'Parallel burst',
    summary: 'Every waiting request starts immediately',
    goodFor: 'Independent tasks where latency matters most',
    tradeoff: 'No backpressure and a noisy active state',
    difference: 'Unbounded Effect concurrency',
    concurrency: 'unbounded',
    order: 'fifo',
    layout: 'grid',
    animation: 'pop',
    durationMs: 5000,
  },
  {
    id: 'wave-two',
    category: 'Batching',
    label: 'Pairs in waves',
    summary: 'Two requests finish before the next pair starts',
    goodFor: 'Comparing small batches as a unit',
    tradeoff: 'A fast lane waits for its paired slow lane',
    difference: 'A batch barrier separates each pair',
    concurrency: 2,
    batchSize: 2,
    order: 'fifo',
    layout: 'wave',
    animation: 'pulse',
    durationMs: 5000,
  },
  {
    id: 'wave-four',
    category: 'Batching',
    label: 'Room waves',
    summary: 'Four requests start and finish as one wave',
    goodFor: 'Periodic synthesis across a whole room',
    tradeoff: 'New arrivals wait for the next wave',
    difference: 'A four-request batch barrier',
    concurrency: 4,
    batchSize: 4,
    order: 'fifo',
    layout: 'wave',
    animation: 'stagger',
    durationMs: 5200,
  },
  {
    id: 'fair-wave',
    category: 'Batching',
    label: 'One per person',
    summary: 'Each wave takes at most one request per person',
    goodFor: 'Preventing one participant from filling a wave',
    tradeoff: 'A person’s follow-up is deliberately deferred',
    difference: 'Identity diversity shapes every batch',
    concurrency: 'unbounded',
    batchSize: 4,
    order: 'round-robin',
    layout: 'wave',
    animation: 'stagger',
    durationMs: 5200,
  },
  {
    id: 'quick-pair',
    category: 'Batching',
    label: 'Quick-win pair',
    summary: 'The two shortest prompts run together',
    goodFor: 'Fast visible progress under load',
    tradeoff: 'Long requests can remain untouched',
    difference: 'Shortest-first ordering with two lanes',
    concurrency: 2,
    order: 'shortest',
    layout: 'lanes',
    animation: 'fade',
    durationMs: 2800,
  },
  {
    id: 'host-plus-one',
    category: 'Batching',
    label: 'Host plus one',
    summary: 'The host and one room request advance together',
    goodFor: 'Facilitation without fully blocking participants',
    tradeoff: 'Host work permanently consumes half the capacity',
    difference: 'Priority ordering feeds two bounded lanes',
    concurrency: 2,
    order: 'host-first',
    layout: 'lanes',
    animation: 'slide',
    durationMs: 5000,
  },
  {
    id: 'adaptive',
    category: 'Adaptive',
    label: 'Adaptive pressure',
    summary: 'The queue opens three lanes when demand rises',
    goodFor: 'Keeping calm when quiet and draining spikes quickly',
    tradeoff: 'The interaction model changes with load',
    difference: 'Capacity responds to queue depth',
    concurrency: 3,
    order: 'fifo',
    layout: 'lanes',
    animation: 'pulse',
    durationMs: 4400,
  },
  {
    id: 'shuffle',
    category: 'Adaptive',
    label: 'Visible lottery',
    summary: 'A deterministic shuffle chooses the order',
    goodFor: 'Low-stakes ideation where equal surprise is useful',
    tradeoff: 'Poor fit for urgent or accountable work',
    difference: 'Stable random-looking order replaces priority',
    concurrency: 1,
    order: 'shuffle',
    layout: 'compact',
    animation: 'pop',
    durationMs: 4000,
  },
  {
    id: 'newest-per-person',
    category: 'Adaptive',
    label: 'Freshest per person',
    summary: 'Each person’s newest request is considered first',
    goodFor: 'Rooms where people frequently correct themselves',
    tradeoff: 'Earlier context moves behind later clarification',
    difference: 'Recency is applied within each identity',
    concurrency: 2,
    order: 'newest-per-person',
    layout: 'lanes',
    animation: 'fade',
    durationMs: 4200,
  },
  {
    id: 'calm-drain',
    category: 'Adaptive',
    label: 'Calm drain',
    summary: 'One quiet request advances with minimal motion',
    goodFor: 'High-trust rooms where motion is distracting',
    tradeoff: 'Feels slow and hides throughput pressure',
    difference: 'Long pacing with no entry animation',
    concurrency: 1,
    order: 'fifo',
    layout: 'compact',
    animation: 'none',
    durationMs: 7000,
  },
];

export const strategyCategories: StrategyCategory[] = [
  'Order',
  'Fairness',
  'Parallelism',
  'Batching',
  'Adaptive',
];

export function strategyById(id: StrategyId): Strategy {
  return strategies.find((strategy) => strategy.id === id) ?? strategies[0];
}

export function planTurns<T extends PlannableTurn>(
  turns: T[],
  strategy: Strategy,
  servedAuthors: string[],
): T[] {
  const ordered = orderTurns(turns, strategy.order, servedAuthors);
  const diverse = strategy.id === 'fair-wave' ? onePerAuthorFirst(ordered) : ordered;
  if (strategy.id === 'adaptive' && turns.length < 3) return diverse.slice(0, 1);
  return strategy.batchSize ? diverse.slice(0, strategy.batchSize) : diverse;
}

function orderTurns<T extends PlannableTurn>(
  turns: T[],
  order: StrategyOrder,
  servedAuthors: string[],
): T[] {
  const indexed = turns.map((turn, index) => ({ turn, index }));
  if (order === 'lifo') return [...turns].reverse();
  if (order === 'shortest') return stableSort(indexed, (entry) => entry.turn.prompt.length);
  if (order === 'longest') return stableSort(indexed, (entry) => -entry.turn.prompt.length);
  if (order === 'host-first') return stableSort(indexed, (entry) => (entry.turn.authorId === 'maya' ? 0 : 1));
  if (order === 'round-robin') return onePerAuthorFirst(turns);
  if (order === 'least-recent') {
    return stableSort(indexed, (entry) => {
      const servedIndex = servedAuthors.lastIndexOf(entry.turn.authorId);
      return servedIndex === -1 ? -1 : servedIndex;
    });
  }
  if (order === 'participant-blocks') {
    const authorOrder = [...new Set(turns.map((turn) => turn.authorId))];
    return authorOrder.flatMap((authorId) => turns.filter((turn) => turn.authorId === authorId));
  }
  if (order === 'shuffle') {
    return stableSort(indexed, (entry) => hash(entry.turn.id));
  }
  if (order === 'newest-per-person') {
    const latest = new Map<string, T>();
    for (const turn of turns) latest.set(turn.authorId, turn);
    const newest = [...latest.values()].reverse();
    const newestIds = new Set(newest.map((turn) => turn.id));
    return [...newest, ...turns.filter((turn) => !newestIds.has(turn.id))];
  }
  return turns;
}

function onePerAuthorFirst<T extends PlannableTurn>(turns: T[]): T[] {
  const groups = new Map<string, T[]>();
  for (const turn of turns) groups.set(turn.authorId, [...(groups.get(turn.authorId) ?? []), turn]);
  const ordered: T[] = [];
  while (ordered.length < turns.length) {
    for (const group of groups.values()) {
      const next = group.shift();
      if (next) ordered.push(next);
    }
  }
  return ordered;
}

function stableSort<T extends PlannableTurn>(
  indexed: Array<{ turn: T; index: number }>,
  score: (entry: { turn: T; index: number }) => number,
): T[] {
  return indexed
    .sort((left, right) => score(left) - score(right) || left.index - right.index)
    .map((entry) => entry.turn);
}

function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}
