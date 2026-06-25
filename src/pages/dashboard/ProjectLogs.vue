<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Layers } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import AddToProjectDialog from './components/AddToProjectDialog.vue'
import ProjectLogsContent from './components/ProjectLogsContent.vue'
import { useProjectLogsPage } from './composables/useProjectLogsPage'

const {
  selectedProject,
  isLoadingProjects,
  createProjectOpen,
  logs,
  errorMessage,
  isLoadingLogs,
  activePreset,
  dateFrom,
  dateTo,
  hasPendingDateChanges,
  applyPreset,
  applyCustomRange,
} = useProjectLogsPage()

const addToProjectOpen = ref(false)

const openAddToProject = () => {
  addToProjectOpen.value = true
}

const closeAddToProject = () => {
  addToProjectOpen.value = false
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
    <template v-if="isLoadingProjects">
      <div class="flex min-h-0 flex-1 flex-col gap-5">
        <div class="flex items-center gap-3">
          <Skeleton class="size-10 shrink-0 rounded-lg" />
          <div class="space-y-2">
            <Skeleton class="h-6 w-48" />
            <Skeleton class="h-4 w-64" />
          </div>
        </div>

        <div class="flex min-h-0 flex-1 flex-col gap-4 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <Skeleton class="h-9 w-72" />
            <Skeleton class="h-8 w-36" />
          </div>
          <div class="min-h-0 flex-1 space-y-1 overflow-hidden rounded-lg border border-border bg-background/40 p-2">
            <Skeleton
              v-for="n in 8"
              :key="n"
              class="h-9 w-full"
              :style="{ opacity: 1 - n * 0.08 }"
            />
          </div>
        </div>
      </div>
    </template>

    <ProjectLogsContent
      v-else-if="selectedProject"
      :project="selectedProject"
      :logs="logs"
      :error-message="errorMessage"
      :is-loading-logs="isLoadingLogs"
      :active-preset="activePreset"
      :date-from="dateFrom"
      :date-to="dateTo"
      :has-pending-date-changes="hasPendingDateChanges"
      @update:date-from="dateFrom = $event"
      @update:date-to="dateTo = $event"
      @apply-preset="applyPreset"
      @apply-custom-range="applyCustomRange"
      @add-to-project="openAddToProject"
    />

    <div v-else class="flex flex-1 items-center justify-center">
      <div class="text-center">
        <span class="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-muted">
          <Layers class="size-6 text-muted-foreground" />
        </span>
        <p class="text-lg font-medium">Select a project</p>
        <p class="mt-1 text-sm text-muted-foreground">
          Choose a project from the sidebar or create a new one.
        </p>
        <Button class="mt-4" @click="createProjectOpen = true">
          <Plus class="size-4" />
          Create project
        </Button>
      </div>
    </div>

    <AddToProjectDialog :open="addToProjectOpen" :on-close="closeAddToProject" />
  </div>
</template>
