<script lang="ts">
  import { onMount } from 'svelte';
  import { QueueRuntime, type Parallelism } from './queueRuntime';

  type Participant = {
    id: string;
    name: string;
    initials: string;
    color: string;
  };

  type Message = {
    id: string;
    authorId: string;
    text: string;
    time: string;
    turnId?: string;
  };

  type QueueTurn = {
    id: string;
    authorId: string;
    prompt: string;
    status: 'active' | 'queued';
    createdAt: string;
  };

  type StrategyId = 'sequential' | 'bounded' | 'unbounded';

  type Strategy = {
    id: StrategyId;
    label: string;
    summary: string;
    concurrency: Parallelism;
  };

  const participants: Participant[] = [
    { id: 'maya', name: 'Maya Chen', initials: 'MC', color: '#f6821f' },
    { id: 'nora', name: 'Nora Singh', initials: 'NS', color: '#2f7f9f' },
    { id: 'theo', name: 'Theo Martin', initials: 'TM', color: '#23866b' },
    { id: 'luis', name: 'Luis Ortega', initials: 'LO', color: '#7456a8' },
  ];

  const agent: Participant = {
    id: 'agent',
    name: 'Atlas',
    initials: 'A',
    color: '#f6821f',
  };

  const strategies: Strategy[] = [
    {
      id: 'sequential',
      label: 'Sequential',
      summary: 'One request at a time, in arrival order',
      concurrency: 1,
    },
    {
      id: 'bounded',
      label: 'Parallel ×2',
      summary: 'Two requests run at once',
      concurrency: 2,
    },
    {
      id: 'unbounded',
      label: 'Parallel burst',
      summary: 'Every waiting request starts immediately',
      concurrency: 'unbounded',
    },
  ];

  let currentParticipantId = 'maya';
  let strategyId: StrategyId = 'sequential';
  let draft = '';
  let feed: HTMLDivElement;

  let messages: Message[] = [
    {
      id: crypto.randomUUID(),
      authorId: 'agent',
      text: 'I’m here. Everyone can add a request.',
      time: '10:14',
    },
    {
      id: crypto.randomUUID(),
      authorId: 'nora',
      text: 'Pull out the three decisions we still need to make.',
      time: '10:15',
      turnId: 'turn-1',
    },
    {
      id: crypto.randomUUID(),
      authorId: 'theo',
      text: 'Then give me the shortest possible launch checklist.',
      time: '10:15',
      turnId: 'turn-2',
    },
    {
      id: crypto.randomUUID(),
      authorId: 'luis',
      text: 'What is the riskiest assumption in this plan?',
      time: '10:16',
      turnId: 'turn-3',
    },
  ];

  let queue: QueueTurn[] = [
    {
      id: 'turn-1',
      authorId: 'nora',
      prompt: 'Pull out the three decisions we still need to make.',
      status: 'queued',
      createdAt: '10:15',
    },
    {
      id: 'turn-2',
      authorId: 'theo',
      prompt: 'Then give me the shortest possible launch checklist.',
      status: 'queued',
      createdAt: '10:15',
    },
    {
      id: 'turn-3',
      authorId: 'luis',
      prompt: 'What is the riskiest assumption in this plan?',
      status: 'queued',
      createdAt: '10:16',
    },
  ];

  const runtime = new QueueRuntime<QueueTurn>({
    pending: () => queue.filter((turn) => turn.status === 'queued'),
    activate: (turn) => {
      queue = queue.map((candidate) =>
        candidate.id === turn.id ? { ...candidate, status: 'active' } : candidate,
      );
    },
    complete: (turn) => {
      messages = [
        ...messages,
        {
          id: crypto.randomUUID(),
          authorId: agent.id,
          text: 'Ok',
          time: clock(),
          turnId: turn.id,
        },
      ];
      queue = queue.filter((candidate) => candidate.id !== turn.id);
      window.setTimeout(scrollToLatest, 0);
    },
    resetActive: () => {
      queue = queue.map((turn) => ({ ...turn, status: 'queued' }));
    },
  });

  $: activeTurns = queue.filter((turn) => turn.status === 'active');
  $: waitingTurns = queue.filter((turn) => turn.status === 'queued');
  $: strategy = strategies.find((candidate) => candidate.id === strategyId) ?? strategies[0];

  onMount(() => {
    window.setTimeout(runQueue, 900);
  });

  function participant(id: string): Participant {
    return id === agent.id ? agent : participants.find((person) => person.id === id) ?? participants[0];
  }

  function selectedStrategy(): Strategy {
    return strategies.find((candidate) => candidate.id === strategyId) ?? strategies[0];
  }

  function clock(): string {
    return new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(new Date());
  }

  function runQueue(): void {
    runtime.run(selectedStrategy().concurrency);
  }

  async function changeStrategy(): Promise<void> {
    if (queue.length === 0) addStrategySample();
    await runtime.restart(selectedStrategy().concurrency);
  }

  function addStrategySample(): void {
    const samples = [
      ['nora', 'Compare the strongest two options.'],
      ['theo', 'Turn the decision into a launch checklist.'],
      ['luis', 'Challenge the riskiest assumption.'],
      ['maya', 'Give us the one-sentence recommendation.'],
    ] as const;
    const now = clock();
    const turns = samples.map(([authorId, prompt]) => ({
      id: crypto.randomUUID(),
      authorId,
      prompt,
      status: 'queued' as const,
      createdAt: now,
    }));
    queue = turns;
    messages = [
      ...messages,
      ...turns.map((turn) => ({
        id: crypto.randomUUID(),
        authorId: turn.authorId,
        text: turn.prompt,
        time: now,
        turnId: turn.id,
      })),
    ];
    window.setTimeout(scrollToLatest, 0);
  }

  function send(): void {
    const prompt = draft.trim();
    if (!prompt) return;

    const id = crypto.randomUUID();
    const now = clock();
    messages = [
      ...messages,
      {
        id: crypto.randomUUID(),
        authorId: currentParticipantId,
        text: prompt,
        time: now,
        turnId: id,
      },
    ];
    queue = [
      ...queue,
      {
        id,
        authorId: currentParticipantId,
        prompt,
        status: 'queued',
        createdAt: now,
      },
    ];
    draft = '';
    window.setTimeout(scrollToLatest, 0);
    window.setTimeout(runQueue, 50);
  }

  function scrollToLatest(): void {
    if (feed) feed.scrollTop = feed.scrollHeight;
  }

  function handleComposerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }
</script>

<svelte:head>
  <meta name="description" content="A shared agent queue UI experiment" />
</svelte:head>

<main class="flex h-full min-h-0 flex-col bg-[#f7f7f8] text-[#1f2328]">
  <header class="flex h-16 shrink-0 items-center justify-between border-b border-[#d9d9df] bg-white px-5 md:px-8">
    <div class="flex min-w-0 items-center gap-3">
      <div class="grid size-9 shrink-0 place-items-center rounded-lg bg-[#f6821f] text-sm font-semibold text-white">A</div>
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h1 class="truncate text-base font-semibold">Atlas</h1>
          <span class="size-2 rounded-full bg-[#23866b]"></span>
        </div>
        <p class="text-sm text-[#6a6f78]">Shared room with {participants.length} people</p>
      </div>
    </div>
    <div class="flex -space-x-1.5" aria-label="Room participants">
      {#each participants as person}
        <div class="grid size-7 place-items-center rounded-full border-2 border-white text-[11px] font-medium text-white" style:background={person.color} title={person.name}>
          {person.initials}
        </div>
      {/each}
    </div>
  </header>

  <div class="relative min-h-0 flex-1">
    <div bind:this={feed} class="absolute inset-0 overflow-y-auto px-4 py-6 md:px-8">
      <div class="mx-auto flex max-w-3xl flex-col gap-5 pb-4">
        {#each messages as message (message.id)}
          {@const author = participant(message.authorId)}
          {@const isAgent = message.authorId === agent.id}
          <article class="flex gap-3">
            <div class="grid size-8 shrink-0 place-items-center rounded-lg text-xs font-medium text-white" style:background={author.color}>
              {author.initials}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline gap-2">
                <span class="text-sm font-medium">{author.name}</span>
                <span class="font-mono text-xs text-[#7b8089]">{message.time}</span>
              </div>
              <p class="mt-1 text-sm leading-6 {isAgent ? 'text-[#1f2328]' : 'text-[#42474f]'}">{message.text}</p>
            </div>
          </article>
        {/each}

        {#if queue.length > 0}
          <section class="inline-queue inline-queue-{strategy.id} ml-11 border-y border-[#d9d9df] py-3">
            <div class="flex items-center justify-between gap-4">
              <div>
                <h2 class="text-sm font-medium">Agent queue</h2>
                <p class="text-sm text-[#6a6f78]">{strategy.summary}</p>
              </div>
              <span class="font-mono text-xs text-[#6a6f78]">{activeTurns.length} active · {waitingTurns.length} waiting</span>
            </div>

            {#if activeTurns.length > 0}
              <div class="inline-active inline-active-{strategy.id} mt-3">
                {#each activeTurns as turn, index (turn.id)}
                  {@const activeAuthor = participant(turn.authorId)}
                  <div class="active-turn active-turn-{strategy.id} flex min-w-0 items-center gap-2 rounded-lg bg-[#fff4eb] px-3 py-2 ring-1 ring-[#f7c69f]" style:--lane={index}>
                    <span class="size-2 shrink-0 animate-pulse rounded-full bg-[#f6821f]"></span>
                    <span class="shrink-0 text-sm font-medium">{activeAuthor.name}</span>
                    <span class="truncate text-sm text-[#6a6f78]">{turn.prompt}</span>
                  </div>
                {/each}
              </div>
            {/if}

            {#if waitingTurns.length > 0}
              <ol class="mt-2 space-y-1">
                {#each waitingTurns as turn, index (turn.id)}
                  {@const author = participant(turn.authorId)}
                  <li class="flex items-center gap-2 py-1 text-sm text-[#6a6f78]">
                    <span class="w-5 shrink-0 text-right font-mono text-xs">{index + 1}</span>
                    <span class="shrink-0 font-medium text-[#42474f]">{author.name}</span>
                    <span class="truncate">{turn.prompt}</span>
                  </li>
                {/each}
              </ol>
            {/if}
          </section>
        {/if}

        {#if activeTurns.length > 0}
          <div class="ml-11 flex items-center gap-2 text-sm text-[#6a6f78]">
            <span class="size-2 animate-pulse rounded-full bg-[#f6821f]"></span>
            <span>Atlas is working on {activeTurns.length === 1 ? 'a request' : `${activeTurns.length} requests`}.</span>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <footer class="shrink-0 border-t border-[#d9d9df] bg-white px-4 py-4 md:px-8">
    <div class="mx-auto max-w-3xl">
      <div class="rounded-xl bg-white p-2 ring-1 ring-[#b9bdc5] focus-within:ring-2 focus-within:ring-[#f6821f]">
        <textarea
          bind:value={draft}
          on:keydown={handleComposerKeydown}
          aria-label="Message Atlas"
          rows="2"
          placeholder="Message Atlas"
          class="max-h-32 min-h-14 w-full resize-none bg-transparent px-2 py-1 text-sm leading-6 outline-none placeholder:text-[#8b9098]"
        ></textarea>
        <div class="flex items-center justify-between gap-3 px-1 pt-1">
          <label class="flex min-w-0 items-center gap-2 text-sm text-[#6a6f78]" for="speaker">
            <span class="shrink-0">Send as</span>
            <select id="speaker" bind:value={currentParticipantId} class="min-w-0 cursor-pointer rounded-md bg-[#f1f1f3] px-2 py-1.5 text-sm font-medium text-[#1f2328]">
              {#each participants as person}
                <option value={person.id}>{person.name}</option>
              {/each}
            </select>
          </label>

          <div class="flex items-center gap-2">
            <label class="sr-only" for="strategy">Queue strategy</label>
            <select id="strategy" bind:value={strategyId} on:change={changeStrategy} class="cursor-pointer rounded-md bg-[#f1f1f3] px-2 py-1.5 text-sm font-medium text-[#1f2328]">
              {#each strategies as option}
                <option value={option.id}>{option.label}</option>
              {/each}
            </select>
            <button on:click={send} disabled={!draft.trim()} class="rounded-md bg-[#f6821f] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#d96f15] disabled:cursor-not-allowed disabled:opacity-40">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</main>
