<script lang="ts">
  import type { EditorView } from '@codemirror/view'
  import { onMount, onDestroy } from 'svelte'
  import { markChallengeSolved } from '@/lib/challenge-progress'
  import { buildUrlWithQueryParam, encodeBase64UrlValue, readBase64QueryParam } from '@/lib/url-state'

  type TestCase = {
    description: string
    input: unknown[]
    expected: unknown
  }

  type TestResult = {
    description: string
    pass: boolean
    actual?: unknown
    expected?: unknown
    error?: string
  }

  type Props = {
    challengeId?: string
    complexity?: { time: string; space: string } | null
    hints?: string[]
    solutionLanguage?: 'javascript' | 'typescript' | 'python'
    starterCode: string
    testCases?: TestCase[]
  }

  let {
    starterCode,
    testCases = [],
    solutionLanguage = 'typescript',
    challengeId = '',
    hints = [],
    complexity = null,
  }: Props = $props()

  let editorEl = $state<HTMLDivElement | null>(null)
  let editorView = $state<EditorView | null>(null)
  let activeWorker = $state<Worker | null>(null)

  let code = $state('')
  let results = $state<TestResult[]>([])
  let running = $state(false)
  let hasRun = $state(false)
  let hasResolvedInitialCode = $state(false)
  let compileError = $state('')
  let mountError = $state('')
  let runTimer = $state<ReturnType<typeof setTimeout> | null>(null)
  let shareCopiedTimer = $state<ReturnType<typeof setTimeout> | null>(null)
  let attemptCount = $state(0)
  let unlockedHints = $state(0)
  let solvedAtAttempt = $state<number | null>(null)
  let shareCopied = $state(false)

  let supportsExecution = $derived(
    solutionLanguage === 'javascript' || solutionLanguage === 'typescript',
  )
  let passCount = $derived(results.filter((result) => result.pass).length)
  let failCount = $derived(results.filter((result) => !result.pass).length)
  let allPass = $derived(hasRun && !compileError && failCount === 0 && passCount > 0)

  function getCodeStorageKey() {
    return challengeId ? `challenge-code-${challengeId}` : ''
  }

  function resolveInitialCode() {
    const sharedCode = readBase64QueryParam('code')

    if (sharedCode) {
      return sharedCode
    }

    const codeStorageKey = getCodeStorageKey()

    if (!codeStorageKey || typeof localStorage === 'undefined') {
      return starterCode
    }

    try {
      return localStorage.getItem(codeStorageKey) ?? starterCode
    } catch {
      return starterCode
    }
  }

  function persistCode(nextCode: string) {
    const codeStorageKey = getCodeStorageKey()

    if (!codeStorageKey) {
      return
    }

    try {
      localStorage.setItem(codeStorageKey, nextCode)
    } catch {}
  }

  function getFunctionName(code: string): string {
    const match = code.match(/(?:export\s+)?(?:async\s+)?function\s+(\w+)/)
    return match?.[1] ?? 'solution'
  }

  /**
   * Minimal TypeScript → JavaScript type stripper.
   * Handles common patterns in algorithmic challenge code.
   * Not a full transpiler — just removes type annotations.
   */
  function stripTypes(code: string): string {
    let s = code

    // 1. Remove `export` modifiers
    s = s.replace(/\bexport\s+/g, '')

    // 2. Remove generic type params from function declarations: function foo<T, K>(
    s = s.replace(/\b(function\s+\w+)\s*<[^(]*>/g, '$1')

    // 3. Remove return type annotations: ): SomeType | null {
    //    Critical: do NOT include \{...\} — that would eat the function body.
    //    Only match up to (but not including) the opening brace.
    s = s.replace(/\)\s*:\s*(?:[^{(;\n=]|\[[^\]]*\])*(?=\s*[{;=\n])/g, ')')

    // 4. Remove optional+typed params: name?: SomeType  (before comma or close-paren)
    s = s.replace(/(\w+)\?:\s*(?:[\w<>\[\]|&. ]+?)(?=[,)])/g, '$1 = undefined')

    // 5. Remove typed params: name: SomeType  (before comma or close-paren)
    s = s.replace(/(\w+):\s*(?:[\w<>\[\]|&. ]+?)(?=[,)])/g, '$1')

    // 6. Remove type annotations in variable declarations: const x: Type =
    s = s.replace(/((?:const|let|var)\s+\w+)\s*:\s*[^\n=]+(?==)/g, '$1')

    // 7. Remove generic type args (handles nested generics one level deep)
    s = s.replace(/\b(\w+)<(?:[^<>(){}]|<[^<>(){}]*>)*>/g, '$1')

    // 8. Remove `as Type` assertions
    s = s.replace(/\s+as\s+[\w<>\[\]|& ]+/g, '')

    // 9. Remove non-null assertions: value! or expr()! → value / expr()
    //    Preceding char can be a word char OR closing ) or ]
    s = s.replace(/([)\]\w])!(?=[.[\]),; \t\n])/g, '$1')

    return s
  }

  function clearRunTimeout() {
    if (runTimer) {
      clearTimeout(runTimer)
      runTimer = null
    }
  }

  function clearShareCopiedTimeout() {
    if (shareCopiedTimer) {
      clearTimeout(shareCopiedTimer)
      shareCopiedTimer = null
    }
  }

  function disposeWorker(worker: Worker | null = activeWorker) {
    worker?.terminate()

    if (worker === activeWorker) {
      activeWorker = null
    }
  }

  function buildWorkerScript(jsCode: string, fnName: string, cases: TestCase[]): string {
    return `
${jsCode}

const __cases = ${JSON.stringify(cases)};
(async () => {
  const __results = await Promise.all(__cases.map(async ({ description, input, expected }) => {
    try {
      const actual = await Promise.resolve(${fnName}(...input));
      const pass = JSON.stringify(actual) === JSON.stringify(expected);
      return { description, pass, actual, expected };
    } catch (e) {
      return { description, pass: false, error: String(e) };
    }
  }));

  postMessage({ __type: 'test-results', results: __results });
})().catch((error) => {
  postMessage({
    __type: 'worker-error',
    error: error instanceof Error ? error.message : String(error),
  });
});
`.trim()
  }

  onMount(async () => {
    code = resolveInitialCode()
    hasResolvedInitialCode = true

    try {
      if (!editorEl) {
        mountError = 'Editor indisponivel'
        return
      }

      const isTypeScript = solutionLanguage === 'typescript'

      const [
        { EditorState },
        { EditorView, lineNumbers, highlightActiveLine },
        javascriptModule,
        { oneDark },
      ] = await Promise.all([
        import('@codemirror/state'),
        import('@codemirror/view'),
        supportsExecution ? import('@codemirror/lang-javascript') : Promise.resolve(null),
        import('@codemirror/theme-one-dark'),
      ])

      editorView = new EditorView({
        state: EditorState.create({
          doc: code,
          extensions: [
            lineNumbers(),
            highlightActiveLine(),
            ...(javascriptModule ? [javascriptModule.javascript({ typescript: isTypeScript })] : []),
            oneDark,
            EditorView.lineWrapping,
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                code = update.state.doc.toString()
                persistCode(code)
              }
            }),
            EditorView.domEventHandlers({
              keydown(e) {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault()
                  run()
                }
              },
            }),
            EditorView.theme({
              '&': { fontSize: '0.875rem' },
              '.cm-scroller': {
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              },
              '.cm-content': { padding: '12px 0' },
            }),
          ],
        }),
        parent: editorEl,
      })
    } catch (e) {
      mountError = e instanceof Error ? e.message : String(e)
    }
  })

  function reset() {
    code = starterCode
    const codeStorageKey = getCodeStorageKey()

    if (codeStorageKey) {
      try { localStorage.removeItem(codeStorageKey) } catch {}
    }
    if (editorView) {
      editorView.dispatch({
        changes: { from: 0, to: editorView.state.doc.length, insert: starterCode },
      })
    }
    results = []
    hasRun = false
    compileError = ''
  }

  onDestroy(() => {
    clearRunTimeout()
    clearShareCopiedTimeout()
    disposeWorker()
    editorView?.destroy()
  })

  function run() {
    if (running) return
    if (!supportsExecution) {
      results = []
      compileError = 'Execucao interativa disponivel apenas para JavaScript e TypeScript.'
      hasRun = true
      return
    }

    clearRunTimeout()

    running = true
    hasRun = false
    results = []
    compileError = ''
    attemptCount += 1

    disposeWorker()

    const fnName = getFunctionName(code)

    let jsCode: string
    if (solutionLanguage === 'javascript') {
      jsCode = code
    } else {
      try {
        jsCode = stripTypes(code)
      } catch (e) {
        compileError = e instanceof Error ? e.message : 'Erro ao processar tipos TypeScript'
        running = false
        hasRun = true
        return
      }
    }

    const workerScript = buildWorkerScript(jsCode, fnName, testCases)

    let blob: Blob
    let blobUrl: string
    try {
      blob = new Blob([workerScript], { type: 'application/javascript' })
      blobUrl = URL.createObjectURL(blob)
    } catch (e) {
      compileError = 'Erro ao criar ambiente de execução'
      running = false
      hasRun = true
      return
    }

    const worker = new Worker(blobUrl)
    URL.revokeObjectURL(blobUrl)
    activeWorker = worker

    worker.onmessage = (event) => {
      if (event.data?.__type === 'test-results') {
        results = event.data.results
        running = false
        hasRun = true
        compileError = ''
        clearRunTimeout()
        disposeWorker(worker)

        const allPassed = results.length > 0 && results.every((r) => r.pass)
        if (allPassed) {
          if (solvedAtAttempt === null) solvedAtAttempt = attemptCount
          markChallengeSolved(challengeId)
        }
      } else if (event.data?.__type === 'worker-error') {
        compileError = event.data.error ?? 'Erro de execucao'
        running = false
        hasRun = true
        clearRunTimeout()
        disposeWorker(worker)
      }
    }

    worker.onerror = (error) => {
      const msg = error.message ?? 'Erro de execução'
      const line = error.lineno
      // lineno maps directly to the user's code since jsCode is prepended first
      compileError = line && line > 0 ? `Linha ${line}: ${msg}` : msg
      running = false
      hasRun = true
      clearRunTimeout()
      disposeWorker(worker)
    }

    runTimer = setTimeout(() => {
      if (running) {
        running = false
        hasRun = true
        compileError = 'Tempo limite excedido. Verifique se há loops infinitos.'
        disposeWorker(worker)
      }
    }, 10000)
  }

  function unlockHint() {
    if (unlockedHints < hints.length) unlockedHints += 1
  }

  async function shareCode() {
    try {
      const url = buildUrlWithQueryParam('code', encodeBase64UrlValue(code))

      if (!url || typeof navigator.clipboard?.writeText !== 'function') {
        return
      }

      await navigator.clipboard.writeText(url.toString())
      shareCopied = true
      clearShareCopiedTimeout()
      shareCopiedTimer = setTimeout(() => {
        shareCopied = false
        shareCopiedTimer = null
      }, 2000)
    } catch {}
  }

  function ordinal(n: number): string {
    return `${n}ª`
  }

  function handleFallbackInput(event: Event) {
    persistCode((event.currentTarget as HTMLTextAreaElement).value)
  }
</script>

<div class="mx-auto mt-10 max-w-4xl">
  <div class="challenge-playground-shell overflow-hidden rounded-xl border border-site-line">
    <!-- Toolbar -->
    <div class="challenge-playground-toolbar flex items-center justify-between gap-4 border-b px-4 py-2.5">
      <div class="flex items-center gap-3">
        <span class="challenge-playground-filename font-mono text-xs">
          {solutionLanguage === 'typescript'
            ? 'solution.ts'
            : solutionLanguage === 'javascript'
              ? 'solution.js'
              : 'solution.py'}
        </span>
        {#if hasResolvedInitialCode && code !== starterCode}
          <button
            onclick={reset}
            title="Voltar ao código inicial"
            class="challenge-playground-toolbar-action inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors"
          >
            <svg class="size-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Reset
          </button>
        {/if}
      </div>
      <div class="flex items-center gap-3">
        {#if attemptCount > 0}
          <span class="challenge-playground-meta text-xs">
            {attemptCount === 1 ? '1 tentativa' : `${attemptCount} tentativas`}
          </span>
        {/if}
        <button
          onclick={run}
          disabled={running || !supportsExecution}
          title={supportsExecution ? 'Executar (Ctrl+Enter)' : 'Execucao interativa disponivel apenas para JavaScript e TypeScript'}
          class="challenge-playground-primary inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-60"
        >
          {#if running}
            <svg class="size-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            Executando...
          {:else if supportsExecution}
            <svg
              class="size-3.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Executar
          {:else}
            Execucao indisponivel
          {/if}
        </button>
      </div>
    </div>

    <!-- CodeMirror editor (or fallback textarea) -->
    {#if mountError}
      <div class="challenge-playground-editor-error border-b p-3 font-mono text-xs">
        Editor error: {mountError}
      </div>
    {/if}
    <div bind:this={editorEl} class="max-h-[480px] min-h-48 overflow-auto"></div>
    {#if mountError}
      <textarea
        class="challenge-playground-fallback min-h-48 w-full resize-y p-4 font-mono text-sm outline-none"
        bind:value={code}
        oninput={handleFallbackInput}
        spellcheck="false"
      ></textarea>
    {/if}

    <!-- Hints panel -->
    {#if hints.length > 0 && !allPass}
      <div class="challenge-playground-panel border-t px-4 py-3">
        <div class="flex items-center justify-between">
          <span class="challenge-playground-meta text-xs">
            {#if unlockedHints === 0}
              Travado? Dicas disponíveis.
            {:else if unlockedHints < hints.length}
              {unlockedHints}/{hints.length} dica{unlockedHints === 1 ? '' : 's'} revelada{unlockedHints === 1 ? '' : 's'}
            {:else}
              Todas as dicas reveladas
            {/if}
          </span>
          {#if unlockedHints < hints.length}
            <button
              onclick={unlockHint}
              class="challenge-playground-toolbar-action challenge-playground-outline-action inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors"
            >
              <svg class="size-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {unlockedHints === 0 ? 'Ver dica' : 'Próxima dica'}
            </button>
          {/if}
        </div>
        {#if unlockedHints > 0}
          <ul class="mt-3 grid gap-2">
            {#each hints.slice(0, unlockedHints) as hint, i}
              <li class="challenge-playground-hint flex gap-2.5 rounded-md px-3 py-2">
                <span class="challenge-playground-hint-index shrink-0 font-mono text-xs font-medium">{i + 1}.</span>
                <p class="challenge-playground-body text-xs">{hint}</p>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/if}

    <!-- Results panel -->
    {#if hasRun}
      <div class="challenge-playground-panel border-t p-4">
        {#if compileError}
          <div class="flex items-start gap-2.5">
            <span class="challenge-playground-issue-ink mt-0.5">
              <svg
                class="size-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
            <div>
              <p class="challenge-playground-issue-title text-sm font-medium">Erro de execução</p>
              <p class="challenge-playground-body mt-1 font-mono text-xs">{compileError}</p>
            </div>
          </div>
        {:else}
          <div class="mb-3 flex items-center gap-3">
            <span
              class="text-xs font-medium {allPass
                ? 'challenge-playground-success-ink'
                : 'challenge-playground-issue-ink'}"
            >
              {passCount}/{results.length} testes passando
            </span>
            {#if allPass}
              <span
                class="badge-allpass challenge-playground-success-badge inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
              >
                <svg
                  class="size-3"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Todos passando
              </span>
            {/if}
          </div>

          {#if allPass}
            <div class="mb-3 grid gap-2">
              <div class="challenge-playground-success-card flex flex-wrap items-center justify-between gap-3 rounded-md px-3 py-2">
                <div class="flex flex-wrap items-center gap-4">
                  {#if solvedAtAttempt !== null}
                    <span class="challenge-playground-success-copy text-xs font-medium">
                      {solvedAtAttempt === 1 ? 'Resolvido na primeira tentativa!' : `Resolvido na ${ordinal(solvedAtAttempt)} tentativa`}
                    </span>
                  {/if}
                </div>
                <button
                  onclick={shareCode}
                  title="Copiar link com sua solução"
                  class="challenge-playground-share inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors"
                >
                  {#if shareCopied}
                    <svg class="size-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Link copiado!
                  {:else}
                    <svg class="size-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    Compartilhar
                  {/if}
                </button>
              </div>
              {#if complexity}
                <div class="challenge-playground-warning-card flex items-start gap-2.5 rounded-md px-3 py-2">
                  <svg class="challenge-playground-warning-ink mt-0.5 size-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p class="challenge-playground-warning-copy text-xs">
                    Sua solução passa. Existe uma versão mais eficiente — solução ótima em tempo <strong class="font-mono">{complexity.time}</strong> e espaço <strong class="font-mono">{complexity.space}</strong>. Veja em "Ver solução".
                  </p>
                </div>
              {/if}
            </div>
          {/if}

          <ul class="grid gap-2">
            {#each results as result}
              <li
                class="challenge-playground-result-card flex items-start gap-2.5 rounded-md px-3 py-2.5 {result.pass
                  ? 'challenge-playground-result-card--pass'
                  : 'challenge-playground-result-card--fail'}"
              >
                <span
                  class="mt-0.5 shrink-0 {result.pass
                    ? 'challenge-playground-success-ink'
                    : 'challenge-playground-issue-ink'}"
                >
                  {#if result.pass}
                    <svg
                      class="size-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  {:else}
                    <svg
                      class="size-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  {/if}
                </span>
                <div class="min-w-0 flex-1">
                  <p class="challenge-playground-body text-sm">{result.description}</p>
                  {#if !result.pass}
                    <div class="mt-1.5 grid gap-1">
                      {#if result.error}
                        <p class="challenge-playground-error-copy font-mono text-xs">Erro: {result.error}</p>
                      {:else}
                        <p class="challenge-playground-meta font-mono text-xs">
                          esperado:
                          <span class="challenge-playground-body">{JSON.stringify(result.expected)}</span>
                        </p>
                        <p class="challenge-playground-meta font-mono text-xs">
                          recebido:
                          <span class="challenge-playground-error-copy">{JSON.stringify(result.actual)}</span>
                        </p>
                      {/if}
                    </div>
                  {/if}
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes pulse-green {
    0% {
      box-shadow: 0 0 0 0 color-mix(in srgb, var(--site-success) 40%, transparent);
    }

    70% {
      box-shadow: 0 0 0 6px transparent;
    }

    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }

  .badge-allpass {
    animation: pulse-green 0.6s ease-out 1;
  }

  .challenge-playground-shell {
    --challenge-success-ink: var(--site-success);
    --challenge-success-bg: color-mix(in srgb, var(--site-success) 12%, transparent);
    --challenge-success-ring: color-mix(in srgb, var(--site-success) 26%, transparent);
    --challenge-warning-ink: color-mix(
      in srgb,
      var(--site-highlight-badge-ink) 76%,
      var(--site-base-ink-bright) 24%
    );
    --challenge-warning-bg: color-mix(in srgb, var(--site-highlight-badge-ink) 8%, transparent);
    --challenge-warning-ring: color-mix(in srgb, var(--site-highlight-badge-ink) 22%, transparent);
    --challenge-issue-ink: color-mix(
      in srgb,
      var(--site-link-hover) 72%,
      var(--site-highlight-badge-ink) 28%
    );
    --challenge-issue-bg: color-mix(in srgb, var(--site-link-hover) 8%, transparent);
    --challenge-issue-ring: color-mix(in srgb, var(--site-link-hover) 20%, transparent);
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--site-surface-strong) 86%, var(--site-bg)) 0%,
        color-mix(in srgb, var(--site-bg) 82%, black 18%) 100%
      );
  }

  .challenge-playground-toolbar,
  .challenge-playground-panel,
  .challenge-playground-editor-error {
    border-color: color-mix(in srgb, var(--site-line-strong) 62%, transparent);
  }

  .challenge-playground-panel {
    background: color-mix(in srgb, var(--site-surface) 36%, var(--site-bg));
  }

  .challenge-playground-filename,
  .challenge-playground-body {
    color: color-mix(in srgb, var(--site-ink) 82%, var(--site-base-ink-bright) 18%);
  }

  .challenge-playground-meta,
  .challenge-playground-toolbar-action {
    color: color-mix(in srgb, var(--site-ink-muted) 90%, transparent);
  }

  .challenge-playground-toolbar-action:hover {
    color: var(--site-ink);
  }

  .challenge-playground-outline-action {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--site-line-strong) 70%, transparent);
  }

  .challenge-playground-outline-action:hover {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--site-link-hover) 54%, transparent);
  }

  .challenge-playground-primary {
    background: var(--site-accent);
    color: var(--site-base-ink-bright);
  }

  .challenge-playground-editor-error,
  .challenge-playground-issue-title,
  .challenge-playground-issue-ink,
  .challenge-playground-error-copy {
    color: var(--challenge-issue-ink);
  }

  .challenge-playground-fallback {
    background: transparent;
    color: color-mix(in srgb, var(--site-ink) 82%, var(--site-base-ink-bright) 18%);
  }

  .challenge-playground-hint {
    background: var(--challenge-warning-bg);
    box-shadow: inset 0 0 0 1px var(--challenge-warning-ring);
  }

  .challenge-playground-hint-index,
  .challenge-playground-warning-ink {
    color: var(--challenge-warning-ink);
  }

  .challenge-playground-success-ink {
    color: var(--challenge-success-ink);
  }

  .challenge-playground-success-badge {
    background: var(--challenge-success-bg);
    color: var(--challenge-success-ink);
  }

  .challenge-playground-success-card {
    border: 1px solid var(--challenge-success-ring);
    background: var(--challenge-success-bg);
  }

  .challenge-playground-success-copy {
    color: color-mix(in srgb, var(--challenge-success-ink) 82%, var(--site-base-ink-bright) 18%);
  }

  .challenge-playground-share {
    color: var(--challenge-success-ink);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--challenge-success-ink) 32%, transparent);
  }

  .challenge-playground-share:hover {
    background: color-mix(in srgb, var(--challenge-success-ink) 10%, transparent);
  }

  .challenge-playground-warning-card {
    border: 1px solid var(--challenge-warning-ring);
    background: var(--challenge-warning-bg);
  }

  .challenge-playground-warning-copy {
    color: color-mix(in srgb, var(--challenge-warning-ink) 80%, var(--site-base-ink-bright) 20%);
  }

  .challenge-playground-result-card {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--site-line) 40%, transparent);
  }

  .challenge-playground-result-card--pass {
    background: color-mix(in srgb, var(--challenge-success-ink) 10%, transparent);
  }

  .challenge-playground-result-card--fail {
    background: var(--challenge-issue-bg);
  }
</style>
