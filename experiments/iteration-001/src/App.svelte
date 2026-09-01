<script lang="ts">
  import { onMount } from 'svelte';

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

  const participants: Participant[] = [
    { id: 'maya', name: 'Maya Chen', initials: 'MC', color: '#f6821f' },
    { id: 'nora', name: 'Nora Singh', initials: 'NS', color: '#71b8d8' },
    { id: 'theo', name: 'Theo Martin', initials: 'TM', color: '#63d5a2' },
    { id: 'luis', name: 'Luis Ortega', initials: 'LO', color: '#c69cff' },
  ];

  const agent: Participant = {
    id: 'agent',
    name: 'Atlas',
    initials: 'A',
    color: '#f7b53b',
  };

  let currentParticipantId = 'maya';
  let draft = '';
  let processing = false;
  let feed: HTMLDivElement;

  let messages: Message[] = [
    {
      id: crypto.randomUUID(),
      authorId: 'agent',
      text: 'I’m here. Everyone can add a turn; I’ll take them in order.',
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
      status: 'active',
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

  $: activeTurn = queue.find((turn) => turn.status === 'active');
  $: waitingTurns = queue.filter((turn) => turn.status === 'queued');
  $: currentParticipant = participant(currentParticipantId);

  onMount(() => {
    window.setTimeout(runQueue, 900);
  });

  function participant(id: string): Participant {
    return id === agent.id ? agent : participants.find((person) => person.id === id) ?? participants[0];
  }

  function clock(): string {
    return new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(new Date());
  }

  function wait(duration: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, duration));
  }

  async function runQueue(): Promise<void> {
    if (processing) return;
    processing = true;

    while (queue.length > 0) {
      let current = queue.find((turn) => turn.status === 'active');
      if (!current) {
        const next = queue[0];
        queue = queue.map((turn) => (turn.id === next.id ? { ...turn, status: 'active' } : turn));
        current = { ...next, status: 'active' };
      }

      await wait(1500);
      messages = [
        ...messages,
        {
          id: crypto.randomUUID(),
          authorId: agent.id,
          text: 'Ok',
          time: clock(),
          turnId: current.id,
        },
      ];
      window.setTimeout(scrollToLatest, 0);
      queue = queue.filter((turn) => turn.id !== current.id);
      await wait(450);
    }

    processing = false;
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
        status: queue.length === 0 ? 'active' : 'queued',
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

<main class="grid h-full min-h-0 grid-cols-1 text-[#f7f9fb] lg:grid-cols-[minmax(0,1fr)_360px]">
  <section class="flex min-h-0 flex-col border-r border-[rgba(174,196,216,.14)]">
    <header class="flex h-[72px] shrink-0 items-center justify-between border-b border-[rgba(174,196,216,.14)] bg-[#0b1118]/80 px-5 backdrop-blur-xl md:px-7">
      <div class="flex min-w-0 items-center gap-3">
        <div class="relative grid size-10 shrink-0 place-items-center rounded-[.7rem] border border-[#f7b53b]/30 bg-[#f7b53b]/10 font-mono text-sm font-bold text-[#f7b53b]">
          A
          <span class="absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-[#0b1118] bg-[#63d5a2]"></span>
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h1 class="truncate text-[15px] font-bold tracking-[-.02em]">Atlas</h1>
            <span class="rounded-full bg-[#63d5a2]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[.14em] text-[#63d5a2]">available</span>
          </div>
          <p class="truncate text-xs text-[#9baaba]">Shared agent room · {participants.length} people</p>
        </div>
      </div>
      <div class="flex -space-x-2" aria-label="Room participants">
        {#each participants as person}
          <div class="grid size-8 place-items-center rounded-full border-2 border-[#0b1118] text-[10px] font-bold text-[#0b1118]" style:background={person.color} title={person.name}>
            {person.initials}
          </div>
        {/each}
      </div>
    </header>

    <div class="relative min-h-0 flex-1">
      <div bind:this={feed} class="absolute inset-0 overflow-y-auto px-4 py-7 md:px-8">
        <div class="mx-auto flex max-w-3xl flex-col gap-6 pb-4">
          <div class="flex items-center gap-3 py-2">
            <div class="h-px flex-1 bg-[rgba(174,196,216,.12)]"></div>
            <span class="font-mono text-[9px] uppercase tracking-[.18em] text-[#657789]">Today · shared room opened</span>
            <div class="h-px flex-1 bg-[rgba(174,196,216,.12)]"></div>
          </div>

          {#each messages as message (message.id)}
            {@const author = participant(message.authorId)}
            {@const isAgent = message.authorId === agent.id}
            <article class="group flex gap-3.5 {isAgent ? 'pr-5' : 'pl-0 md:pl-8'}">
              <div class="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[.45rem] text-[10px] font-bold text-[#0b1118]" style:background={author.color}>
                {author.initials}
              </div>
              <div class="min-w-0 flex-1">
                <div class="mb-1.5 flex items-baseline gap-2">
                  <span class="text-[13px] font-semibold">{author.name}</span>
                  <span class="font-mono text-[9px] text-[#657789]">{message.time}</span>
                  {#if isAgent}
                    <span class="font-mono text-[8px] uppercase tracking-[.15em] text-[#f7b53b]">agent</span>
                  {/if}
                </div>
                <div class="w-fit max-w-2xl rounded-[.7rem] border px-4 py-3 text-[14px] leading-6 {isAgent ? 'border-[#f7b53b]/20 bg-[#f7b53b]/[.055]' : 'border-[rgba(174,196,216,.12)] bg-[#111a24]/80'}">
                  {message.text}
                </div>
              </div>
            </article>
          {/each}

          {#if activeTurn}
            <div class="flex gap-3.5 pr-5">
              <div class="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[.45rem] bg-[#f7b53b] text-[10px] font-bold text-[#0b1118]">A</div>
              <div>
                <div class="mb-1.5 flex items-baseline gap-2">
                  <span class="text-[13px] font-semibold">Atlas</span>
                  <span class="font-mono text-[8px] uppercase tracking-[.15em] text-[#f7b53b]">working</span>
                </div>
                <div class="flex w-fit items-center gap-1.5 rounded-[.7rem] border border-[#f7b53b]/20 bg-[#f7b53b]/[.055] px-4 py-4">
                  <span class="size-1.5 animate-pulse rounded-full bg-[#f7b53b]"></span>
                  <span class="size-1.5 animate-pulse rounded-full bg-[#f7b53b] [animation-delay:150ms]"></span>
                  <span class="size-1.5 animate-pulse rounded-full bg-[#f7b53b] [animation-delay:300ms]"></span>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <footer class="shrink-0 border-t border-[rgba(174,196,216,.14)] bg-[#0b1118]/90 px-4 py-4 backdrop-blur-xl md:px-7 md:py-5">
      <div class="mx-auto max-w-3xl">
        <div class="mb-2 flex items-center justify-between px-1">
          <label class="flex items-center gap-2 text-[11px] text-[#9baaba]" for="speaker">
            Speaking as
            <select id="speaker" bind:value={currentParticipantId} class="cursor-pointer appearance-none border-0 bg-transparent pr-4 text-[11px] font-semibold text-[#f7f9fb]">
              {#each participants as person}
                <option value={person.id}>{person.name}</option>
              {/each}
            </select>
          </label>
          <span class="font-mono text-[9px] uppercase tracking-[.12em] text-[#657789]">Enter to queue · Shift Enter for line</span>
        </div>
        <div class="flex items-end gap-2 rounded-[.7rem] border border-[rgba(174,196,216,.18)] bg-[#111a24] p-2 shadow-[0_18px_50px_rgba(0,0,0,.28)] focus-within:border-[#f7b53b]/45">
          <textarea
            bind:value={draft}
            on:keydown={handleComposerKeydown}
            aria-label="Message Atlas"
            rows="1"
            placeholder="Ask Atlas anything…"
            class="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-6 text-[#f7f9fb] outline-none placeholder:text-[#657789]"
          ></textarea>
          <button on:click={send} disabled={!draft.trim()} class="grid size-11 shrink-0 place-items-center rounded-[.45rem] bg-[#f6821f] text-lg text-[#0b1118] transition hover:bg-[#f7b53b] disabled:cursor-not-allowed disabled:opacity-30" aria-label="Add to queue">
            ↑
          </button>
        </div>
      </div>
    </footer>
  </section>

  <aside class="hidden min-h-0 flex-col bg-[#0d151e]/92 lg:flex">
    <header class="flex h-[72px] shrink-0 items-center justify-between border-b border-[rgba(174,196,216,.14)] px-5">
      <div>
        <div class="font-mono text-[9px] uppercase tracking-[.2em] text-[#f7b53b]">[ Attention queue ]</div>
        <p class="mt-1 text-xs text-[#9baaba]">One agent, ordered turns</p>
      </div>
      <div class="grid size-8 place-items-center rounded-full border border-[rgba(174,196,216,.16)] font-mono text-xs text-[#f7f9fb]">{queue.length}</div>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto p-4">
      {#if activeTurn}
        {@const activeAuthor = participant(activeTurn.authorId)}
        <section class="mb-6">
          <div class="mb-2.5 flex items-center justify-between px-1">
            <span class="font-mono text-[9px] uppercase tracking-[.16em] text-[#63d5a2]">Now</span>
            <span class="flex items-center gap-1.5 font-mono text-[9px] text-[#63d5a2]"><span class="size-1.5 animate-pulse rounded-full bg-[#63d5a2]"></span> processing</span>
          </div>
          <div class="relative overflow-hidden rounded-[.7rem] border border-[#f7b53b]/25 bg-[#182431] p-4 shadow-[0_14px_34px_rgba(0,0,0,.2)]">
            <div class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#f6821f] to-[#f7b53b]"></div>
            <div class="mb-3 flex items-center gap-2.5">
              <div class="grid size-7 place-items-center rounded-[.45rem] text-[9px] font-bold text-[#0b1118]" style:background={activeAuthor.color}>{activeAuthor.initials}</div>
              <div>
                <div class="text-xs font-semibold">{activeAuthor.name}</div>
                <div class="font-mono text-[8px] text-[#657789]">{activeTurn.createdAt} · turn 01</div>
              </div>
            </div>
            <p class="line-clamp-3 text-[13px] leading-5 text-[#dce5ed]">{activeTurn.prompt}</p>
          </div>
        </section>
      {/if}

      <section>
        <div class="mb-2.5 flex items-center justify-between px-1">
          <span class="font-mono text-[9px] uppercase tracking-[.16em] text-[#9baaba]">Next up</span>
          <span class="font-mono text-[9px] text-[#657789]">{waitingTurns.length} waiting</span>
        </div>
        <div class="flex flex-col gap-2">
          {#each waitingTurns as turn, index (turn.id)}
            {@const author = participant(turn.authorId)}
            <div class="group rounded-[.7rem] border border-[rgba(174,196,216,.12)] bg-[#111a24]/75 p-3.5 transition hover:border-[rgba(174,196,216,.22)] hover:bg-[#182431]">
              <div class="mb-2.5 flex items-center gap-2.5">
                <span class="grid size-6 place-items-center rounded-[.45rem] bg-[#0b1118] font-mono text-[9px] text-[#9baaba]">{index + 1}</span>
                <div class="grid size-6 place-items-center rounded-full text-[8px] font-bold text-[#0b1118]" style:background={author.color}>{author.initials}</div>
                <span class="min-w-0 flex-1 truncate text-[11px] font-semibold">{author.name}</span>
                <span class="font-mono text-[8px] text-[#657789]">{turn.createdAt}</span>
              </div>
              <p class="line-clamp-2 pl-8 text-[12px] leading-[1.15rem] text-[#9baaba]">{turn.prompt}</p>
            </div>
          {/each}

          {#if waitingTurns.length === 0}
            <div class="rounded-[.7rem] border border-dashed border-[rgba(174,196,216,.13)] px-4 py-8 text-center">
              <div class="mb-2 text-lg text-[#657789]">✓</div>
              <p class="text-xs font-medium text-[#9baaba]">Queue is clear</p>
              <p class="mt-1 text-[10px] text-[#657789]">The next message gets immediate attention.</p>
            </div>
          {/if}
        </div>
      </section>
    </div>

    <footer class="shrink-0 border-t border-[rgba(174,196,216,.14)] p-4">
      <div class="flex items-center gap-3 rounded-[.7rem] bg-[#111a24]/70 px-3.5 py-3">
        <div class="grid size-7 place-items-center rounded-[.45rem] bg-[#f7b53b]/10 font-mono text-[10px] text-[#f7b53b]">A</div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between text-[10px]">
            <span class="font-semibold">Atlas capacity</span>
            <span class="font-mono text-[#9baaba]">1 at a time</span>
          </div>
          <div class="mt-2 h-1 overflow-hidden rounded-full bg-[#182431]">
            <div class="h-full w-1/3 rounded-full bg-gradient-to-r from-[#f6821f] to-[#f7b53b]"></div>
          </div>
        </div>
      </div>
    </footer>
  </aside>
</main>
