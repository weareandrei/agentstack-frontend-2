<script setup lang="ts">
import router from '@/router.ts'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Code2, Eye } from '@lucide/vue'
import HomeFeature from './HomeFeature.vue'

const snippet = `curl -X POST https://api.agentstack.dev/ingest \\
  -H "Authorization: Bearer agnt_••••" \\
  -d '{ "level": "info", "message": "Agent run started" }'`
</script>

<template>
  <div class="relative isolate overflow-hidden">
    <div
      class="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center blur-3xl"
      aria-hidden="true"
    >
      <div
        class="h-[28rem] w-[55rem] bg-gradient-to-tr from-purple-500/20 via-blue-500/15 to-red-500/10 opacity-60"
        style="clip-path: ellipse(50% 50% at 50% 50%)"
      />
    </div>

    <section class="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 pb-20 pt-32 text-center">
      <span
        class="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
      >
        <span class="relative flex size-2">
          <span class="absolute inline-flex size-full animate-ping rounded-full bg-purple-500 opacity-75" />
          <span class="relative inline-flex size-2 rounded-full bg-purple-500" />
        </span>
        Now in early access
      </span>

      <h1 class="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
        Agent-centric logs,
        <span class="bg-gradient-to-r from-purple-400 via-blue-400 to-red-400 bg-clip-text text-transparent">
          without the SDK
        </span>
      </h1>

      <p class="max-w-[540px] text-balance text-[1.05rem] leading-relaxed text-muted-foreground">
        Logging built for AI agents. Ship logs over plain HTTP and read them back the same way —
        no SDK lock-in, no ceremony.
      </p>

      <div class="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" @click="router.push('/sign-up')">
          Get early access
          <ArrowRight class="size-4" />
        </Button>
        <Button size="lg" variant="outline" @click="router.push('/docs')">
          Read the docs
        </Button>
      </div>

      <div class="mt-6 w-full max-w-2xl text-left">
        <div class="overflow-hidden rounded-xl border border-border bg-card/70 shadow-2xl shadow-purple-500/5 backdrop-blur">
          <div class="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
            <span class="size-2.5 rounded-full bg-red-400/80" />
            <span class="size-2.5 rounded-full bg-yellow-400/80" />
            <span class="size-2.5 rounded-full bg-green-400/80" />
            <span class="ml-2 text-xs text-muted-foreground">send a log</span>
          </div>
          <pre class="overflow-x-auto px-4 py-3.5"><code class="font-mono text-[0.8rem] leading-relaxed text-foreground/90">{{ snippet }}</code></pre>
        </div>
      </div>
    </section>

    <section class="mx-auto grid max-w-4xl gap-4 px-4 pb-28 sm:grid-cols-3">
      <HomeFeature
        title="No SDK lock-in"
        body="Plain HTTP in, plain HTTP out. If it can make a request, it can log."
      >
        <Zap class="size-4.5 text-foreground" />
      </HomeFeature>

      <HomeFeature
        title="One token, two verbs"
        body="A single project key sends and reads logs. No config, no ceremony."
      >
        <Code2 class="size-4.5 text-foreground" />
      </HomeFeature>

      <HomeFeature
        title="Built for agents"
        body="Structured metadata on every line, grouped by project and severity."
      >
        <Eye class="size-4.5 text-foreground" />
      </HomeFeature>
    </section>
  </div>
</template>
