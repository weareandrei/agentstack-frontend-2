<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { ChevronRight } from '@lucide/vue'

const props = defineProps<{
  level: string
  message: string
  loggedAt: string
  receivedAt?: string
  metadata?: Record<string, unknown>
}>()

const LEVEL_CLASSES: Record<string, string> = {
  error: 'border-l-red-400 text-red-400',
  warn: 'border-l-amber-400 text-amber-400',
  info: 'border-l-border text-muted-foreground',
  debug: 'border-l-border text-muted-foreground',
}

const classes = computed(
  () => LEVEL_CLASSES[props.level] ?? LEVEL_CLASSES.info,
)

const formattedTime = computed(() => new Date(props.loggedAt).toLocaleString())
const formattedReceived = computed(() =>
  props.receivedAt ? new Date(props.receivedAt).toLocaleString() : null,
)

const hasMetadata = computed(
  () => !!props.metadata && Object.keys(props.metadata).length > 0,
)

const prettyMetadata = computed(() =>
  hasMetadata.value ? JSON.stringify(props.metadata, null, 2) : '',
)

const expanded = ref(false)
</script>

<template>
  <div
    :class="cn(
      'rounded border-l-4 bg-background transition-colors hover:bg-foreground/[0.04]',
      classes,
    )"
  >
    <button
      type="button"
      class="flex w-full cursor-pointer items-center gap-3 px-2.5 py-2.5 text-left"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      <ChevronRight
        :class="cn(
          'size-3.5 shrink-0 text-muted-foreground transition-transform',
          expanded && 'rotate-90',
        )"
      />
      <span class="w-12 shrink-0 text-[0.7rem] font-bold uppercase">{{ level }}</span>
      <span class="flex-1 truncate text-sm">{{ message }}</span>
      <span class="shrink-0 text-xs text-muted-foreground">{{ formattedTime }}</span>
    </button>

    <div v-if="expanded" class="space-y-3 border-t border-border px-2.5 py-2.5 pl-9 text-foreground">
      <p class="text-sm leading-relaxed">{{ message }}</p>

      <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
        <dt class="text-muted-foreground">Level</dt>
        <dd class="font-medium uppercase">{{ level }}</dd>

        <dt class="text-muted-foreground">Logged at</dt>
        <dd>{{ formattedTime }}</dd>

        <template v-if="formattedReceived">
          <dt class="text-muted-foreground">Received at</dt>
          <dd>{{ formattedReceived }}</dd>
        </template>
      </dl>

      <div v-if="hasMetadata">
        <p class="mb-1 text-xs text-muted-foreground">Metadata</p>
        <pre class="overflow-x-auto rounded-md border border-border bg-muted/50 p-2.5"><code class="font-mono text-[0.75rem] leading-relaxed">{{ prettyMetadata }}</code></pre>
      </div>
      <p v-else class="text-xs text-muted-foreground">No metadata</p>
    </div>
  </div>
</template>
