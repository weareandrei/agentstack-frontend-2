<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { cn } from '@/lib/utils'
import { Copy, RefreshCw, ExternalLink } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiKeys } from './composables/useApiKeys'

const {
  apiKeyInfo,
  fullApiKey,
  errorMessage,
  isLoading,
  isRotating,
  tokenCopied,
  briefCopied,
  docsUrl,
  displayedApiKey,
  agentBrief,
  rotateApiKey,
  copyApiKey,
  copyAgentBrief,
} = useApiKeys()
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
    <div class="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Agent API keys</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          One key for your agent — copy it, point the agent at the docs, and let it create projects
          and manage logs on its own.
        </p>
      </div>

      <div
        v-if="isLoading"
        class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5"
      >
        <div class="space-y-4">
          <Skeleton class="h-5 w-32" />
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-4 w-3/4" />
        </div>
      </div>

      <div
        v-else
        class="flex flex-col gap-4"
      >
        <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="agent-api-key">Agent API key</Label>
              <div class="flex gap-2">
                <Input
                  id="agent-api-key"
                  :model-value="displayedApiKey || 'No key yet — roll to create one'"
                  readonly
                  class="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  :disabled="isRotating"
                  aria-label="Roll API key"
                  @click="rotateApiKey"
                >
                  <RefreshCw :class="cn('size-4', isRotating && 'animate-spin')" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  :disabled="!fullApiKey"
                  aria-label="Copy API key"
                  @click="copyApiKey(fullApiKey)"
                >
                  <Copy class="size-4" />
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                <template v-if="fullApiKey">
                  Full key visible — copy it now. Roll to generate a new one anytime.
                </template>
                <template v-else-if="apiKeyInfo?.has_key">
                  Roll the key to reveal and copy the full token.
                </template>
                <template v-else>
                  Roll to create your first agent API key.
                </template>
              </p>
              <p v-if="tokenCopied" class="text-xs text-green-400">API key copied</p>
            </div>

            <p v-if="errorMessage" class="text-sm text-red-400">{{ errorMessage }}</p>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
          <div class="grid gap-4">
            <div>
              <h2 class="text-sm font-semibold">Connect your agent</h2>
              <ol class="mt-2 list-decimal space-y-1.5 pl-4 text-sm text-muted-foreground">
                <li>Copy the agent brief below (or just the API key).</li>
                <li>
                  Paste it into your agent's environment — e.g.
                  <code class="rounded bg-muted px-1 py-px font-mono text-xs">AGENTSTACK_API_KEY</code>, or your orchestrator config.
                </li>
                <li>
                  Include the
                  <a
                    :href="docsUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-foreground underline underline-offset-2"
                  >docs URL</a>
                  so the agent can discover the API (plain HTTP, no SDK).
                </li>
              </ol>
            </div>

            <div class="grid gap-2">
              <Label for="agent-brief">Try sending this to your Agent</Label>
              <div class="relative rounded-lg border border-border bg-muted">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  class="absolute right-1.5 top-1.5 z-10 shadow-sm"
                  :aria-label="briefCopied ? 'Copied' : 'Copy agent brief'"
                  @click="copyAgentBrief(agentBrief)"
                >
                  <Copy class="size-3.5" />
                </Button>
                <pre
                  id="agent-brief"
                  class="overflow-x-auto p-3 pr-11"
                ><code class="whitespace-pre-wrap font-mono text-[0.75rem] leading-relaxed">{{ agentBrief }}</code></pre>
              </div>
              <p v-if="briefCopied" class="text-xs text-green-400">Agent brief copied</p>
              <p v-if="!fullApiKey && apiKeyInfo?.has_key" class="text-xs text-muted-foreground">
                Roll the key above first if you want the brief to include the full API key.
              </p>
            </div>

            <RouterLink
              to="/docs"
              class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Open API documentation
              <ExternalLink class="size-3.5" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
