import { Effect, Fiber } from 'effect';

export type Parallelism = number | 'unbounded';

export type RuntimeTurn = {
  id: string;
};

export type QueueRuntimeCallbacks<T extends RuntimeTurn> = {
  pending: () => T[];
  activate: (turn: T) => void;
  complete: (turn: T) => void;
  resetActive: () => void;
};

export class QueueRuntime<T extends RuntimeTurn> {
  private fiber: ReturnType<typeof Effect.runFork> | undefined;

  constructor(private readonly callbacks: QueueRuntimeCallbacks<T>) {}

  run(parallelism: Parallelism, durationMs: number): void {
    if (this.fiber) return;

    const callbacks = this.callbacks;
    const program = Effect.gen(function* () {
      while (true) {
        const pending = callbacks.pending();
        if (pending.length === 0) return;

        yield* Effect.forEach(
          pending,
          (turn, index) =>
            Effect.gen(function* () {
              yield* Effect.sync(() => callbacks.activate(turn));
              yield* Effect.sleep(`${durationMs + (index % 3) * Math.min(300, durationMs / 10)} millis`);
              yield* Effect.sync(() => callbacks.complete(turn));
            }),
          { concurrency: parallelism, discard: true },
        );
      }
    }).pipe(
      Effect.ensuring(
        Effect.sync(() => {
          this.fiber = undefined;
        }),
      ),
    );

    this.fiber = Effect.runFork(program);
  }

  async restart(parallelism: Parallelism, durationMs: number): Promise<void> {
    const active = this.fiber;
    this.fiber = undefined;
    if (active) await Effect.runPromise(Fiber.interrupt(active));
    this.callbacks.resetActive();
    this.run(parallelism, durationMs);
  }
}
