<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { cn } from '@/lib/utils'
import { Plus, KeyRound, Layers, MoreVertical, Pencil, Trash2 } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Project } from '../composables/useProjects'
import { initials } from '../utils'

defineProps<{
  routePath: string
  projects: Project[]
  selectedProjectId: string | null
  isLoadingProjects: boolean
}>()

const emit = defineEmits<{
  'select-project': [projectId: string]
  'create-project': []
  'rename-project': [project: Project]
  'delete-project': [project: Project]
}>()
</script>

<template>
  <aside class="flex h-full w-72 shrink-0 flex-col border-r border-border bg-sidebar">
    <nav class="px-2 pt-4">
      <RouterLink
        to="/dashboard/api-keys"
        :class="cn(
          'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
          routePath === '/dashboard/api-keys'
            ? 'bg-sidebar-accent text-sidebar-accent-foreground ring-1 ring-border'
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
        )"
      >
        <span
          :class="cn(
            'grid size-8 shrink-0 place-items-center rounded-md',
            routePath === '/dashboard/api-keys'
              ? 'bg-foreground text-background'
              : 'bg-muted text-muted-foreground',
          )"
        >
          <KeyRound class="size-4" />
        </span>
        Agent API keys
      </RouterLink>
    </nav>

    <div class="mt-4 flex items-center justify-between px-4 pb-3 pt-2">
      <div class="flex items-center gap-2">
        <Layers class="size-4 text-muted-foreground" />
        <h2 class="text-sm font-semibold tracking-tight text-sidebar-foreground">Projects</h2>
        <span
          v-if="projects.length"
          class="rounded-full bg-sidebar-accent px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground"
        >
          {{ projects.length }}
        </span>
      </div>
      <Button
        size="icon-sm"
        variant="outline"
        aria-label="New project"
        @click="emit('create-project')"
      >
        <Plus class="size-4" />
      </Button>
    </div>

    <div class="flex-1 space-y-1 overflow-y-auto px-2 py-2">
      <div v-if="isLoadingProjects" class="space-y-1">
        <div
          v-for="n in 5"
          :key="n"
          class="flex items-center gap-3 rounded-lg px-2.5 py-2"
        >
          <Skeleton class="size-8 shrink-0 rounded-md" />
          <Skeleton class="h-4 flex-1" :style="{ maxWidth: `${60 + ((n * 37) % 40)}%` }" />
        </div>
      </div>

      <div
        v-else-if="!projects.length"
        class="mx-2 mt-2 rounded-lg border border-dashed border-border px-3 py-6 text-center"
      >
        <p class="text-sm text-muted-foreground">No projects yet</p>
        <Button size="sm" variant="ghost" class="mt-2" @click="emit('create-project')">
          <Plus class="size-3.5" />
          Create one
        </Button>
      </div>

      <template v-else>
        <div
          v-for="project in projects"
          :key="project.id"
          :class="cn(
            'group flex w-full items-center rounded-lg transition-colors',
            routePath === '/dashboard' && project.id === selectedProjectId
              ? 'bg-sidebar-accent text-sidebar-accent-foreground ring-1 ring-border'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
          )"
        >
          <RouterLink
            to="/dashboard"
            class="flex min-w-0 flex-1 items-center gap-3 px-2.5 py-2 text-left"
            @click="emit('select-project', project.id)"
          >
            <span
              :class="cn(
                'grid size-8 shrink-0 place-items-center rounded-md text-xs font-semibold',
                routePath === '/dashboard' && project.id === selectedProjectId
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground',
              )"
            >
              {{ initials(project.name) }}
            </span>
            <span class="truncate text-sm font-medium">{{ project.name }}</span>
          </RouterLink>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                :class="cn(
                  'mr-1 size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100',
                  routePath === '/dashboard' && project.id === selectedProjectId && 'opacity-100',
                )"
                :aria-label="`Actions for ${project.name}`"
                @click.stop
              >
                <MoreVertical class="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" :side-offset="4">
              <DropdownMenuItem @select="emit('rename-project', project)">
                <Pencil class="size-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                class="text-red-400 focus:text-red-400"
                @select="emit('delete-project', project)"
              >
                <Trash2 class="size-4" />
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </template>
    </div>
  </aside>
</template>
