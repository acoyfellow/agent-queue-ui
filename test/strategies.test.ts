import { describe, expect, test } from 'bun:test';
import { planTurns, strategies, strategyById } from '../experiments/iteration-001/src/strategies';

const turns = [
  { id: 'a', authorId: 'nora', prompt: 'medium request' },
  { id: 'b', authorId: 'theo', prompt: 'x' },
  { id: 'c', authorId: 'maya', prompt: 'the longest request in this sample' },
  { id: 'd', authorId: 'nora', prompt: 'new' },
];

describe('strategy catalog', () => {
  test('defines twenty complete and unique strategies', () => {
    expect(strategies).toHaveLength(20);
    expect(new Set(strategies.map((strategy) => strategy.id)).size).toBe(20);

    for (const strategy of strategies) {
      expect(strategy.summary.length).toBeGreaterThan(10);
      expect(strategy.goodFor.length).toBeGreaterThan(10);
      expect(strategy.tradeoff.length).toBeGreaterThan(10);
      expect(strategy.difference.length).toBeGreaterThan(10);
      expect(strategy.durationMs).toBeGreaterThan(0);
    }
  });

  test('every strategy produces a bounded, duplicate-free plan', () => {
    for (const strategy of strategies) {
      const plan = planTurns(turns, strategy, ['nora', 'theo']);
      expect(plan.length).toBeGreaterThan(0);
      expect(plan.length).toBeLessThanOrEqual(turns.length);
      expect(new Set(plan.map((turn) => turn.id)).size).toBe(plan.length);
      expect(plan.every((turn) => turns.includes(turn))).toBe(true);
    }
  });

  test('order strategies visibly disagree', () => {
    expect(planTurns(turns, strategyById('fifo'), [],)[0].id).toBe('a');
    expect(planTurns(turns, strategyById('lifo'), [],)[0].id).toBe('d');
    expect(planTurns(turns, strategyById('shortest'), [],)[0].id).toBe('b');
    expect(planTurns(turns, strategyById('longest'), [],)[0].id).toBe('c');
    expect(planTurns(turns, strategyById('host-first'), [],)[0].authorId).toBe('maya');
  });

  test('batch strategies expose their intended admission bounds', () => {
    expect(planTurns(turns, strategyById('wave-two'), [])).toHaveLength(2);
    expect(planTurns(turns, strategyById('wave-four'), [])).toHaveLength(4);
    expect(planTurns(turns, strategyById('adaptive'), []).length).toBe(4);
    expect(planTurns(turns.slice(0, 2), strategyById('adaptive'), []).length).toBe(1);
  });
});
