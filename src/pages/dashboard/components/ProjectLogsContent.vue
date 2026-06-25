<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Plus, Calendar, Inbox } from '@lucide/vue'
import LogBar from '@/components/LogBar.vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Project } from '../composables/useProjects'
import type { DatePreset, LogItem } from '../composables/useProjectLogs'
import { initials } from '../utils'

const LOG_DATE_PRESETS = [
  { id: '1h', label: 'Last hour' },
  { id: '6h', label: 'Last 6h' },
  { id: '24h', label: 'Last day' },
  { id: 'all', label: 'All time' },
] as const

defineProps<{
  project: Project
  logs: LogItem[]
  errorMessage: string
  isLoadingLogs: boolean
  activePreset: DatePreset
  dateFrom: string
  dateTo: string
  hasPendingDateChanges: boolean
}>()

const emit = defineEmits<{
  'update:dateFrom': [value: string]
  'update:dateTo': [value: string]
  'apply-preset': [preset: Exclude<DatePreset, 'custom'>]
  'apply-custom-range': []
  'add-to-project': []
}>()
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-5">
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        <span
          class="grid size-10 shrink-0 place-items-center rounded-lg bg-foreground text-sm font-semibold text-background"
        >
          {{ initials(project.name) }}
        </span>
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">{{ project.name }}</h1>
          <p class="text-sm text-muted-foreground">Safe and AI-friendly collection of all your logs</p>
        </div>
      </div>
    </div>

    <div class="flex min-h-0 flex-1 flex-col gap-4 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <div class="inline-flex items-center gap-0.5 rounded-lg border border-border bg-background p-0.5">
            <button
              v-for="preset in LOG_DATE_PRESETS"
              :key="preset.id"
              type="button"
              :class="cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                activePreset === preset.id && !hasPendingDateChanges
                  ? 'bg-secondary text-secondary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )"
              @click="emit('apply-preset', preset.id)"
            >
              {{ preset.label }}
            </button>
          </div>

          <div class="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 [color-scheme:dark]">
            <Calendar class="size-4 shrink-0 text-muted-foreground" />
            <input
              :value="dateFrom"
              type="datetime-local"
              aria-label="From date"
              class="bg-transparent text-xs text-foreground outline-none"
              @input="emit('update:dateFrom', ($event.target as HTMLInputElement).value)"
            />
            <span class="text-xs text-muted-foreground">→</span>
            <input
              :value="dateTo"
              type="datetime-local"
              aria-label="To date"
              class="bg-transparent text-xs text-foreground outline-none"
              @input="emit('update:dateTo', ($event.target as HTMLInputElement).value)"
            />
            <Button
              v-if="hasPendingDateChanges"
              size="xs"
              class="ml-1"
              @click="emit('apply-custom-range')"
            >
              Apply
            </Button>
          </div>
        </div>

        <Button class="shrink-0" @click="emit('add-to-project')">
          <Plus class="size-4" />
          Add to my project
        </Button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto rounded-lg border border-border bg-background/40">
        <div v-if="isLoadingLogs" class="flex flex-col gap-1 p-2">
          <Skeleton
            v-for="n in 8"
            :key="n"
            class="h-9 w-full"
            :style="{ opacity: 1 - n * 0.08 }"
          />
        </div>

        <div
          v-else-if="!logs.length"
          class="grid h-full place-items-center py-16 text-center"
        >
          <div class="flex flex-col items-center gap-2">
            <span class="grid size-11 place-items-center rounded-full bg-muted">
              <Inbox class="size-5 text-muted-foreground" />
            </span>
            <p class="text-sm font-medium text-muted-foreground">No logs received yet</p>
          </div>
        </div>

        <div v-else class="flex flex-col gap-0.5 p-2">
          <LogBar
            v-for="log in logs"
            :key="log.id"
            :level="log.level"
            :message="log.message"
            :logged-at="log.logged_at"
            :received-at="log.received_at"
            :metadata="log.metadata"
          />
        </div>
      </div>

      <p v-if="errorMessage" class="text-sm text-red-400">{{ errorMessage }}</p>
    </div>
  </div>
</template>
