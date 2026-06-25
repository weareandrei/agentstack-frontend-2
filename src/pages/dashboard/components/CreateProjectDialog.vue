<script setup lang="ts">
import { Copy } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

defineProps<{
  open: boolean
  newProjectName: string
  createdToken: string
  selectedProjectName: string | undefined
  errorMessage: string
  isCreating: boolean
  tokenCopied: boolean
}>()

const emit = defineEmits<{
  'update:open': [open: boolean]
  'update:newProjectName': [name: string]
  create: []
  close: []
  'copy-token': []
}>()
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ createdToken ? 'Project created' : 'Create a project' }}</DialogTitle>
      </DialogHeader>

      <div v-if="!createdToken" class="grid gap-4 py-2">
        <div class="grid gap-2">
          <Label for="project-name">Project name</Label>
          <Input
            id="project-name"
            :model-value="newProjectName"
            placeholder="My project"
            @update:model-value="emit('update:newProjectName', String($event))"
            @keyup.enter="emit('create')"
          />
        </div>

        <p v-if="errorMessage" class="text-sm text-red-400">{{ errorMessage }}</p>
      </div>

      <div v-else class="grid gap-4 py-2">
        <p class="text-sm text-muted-foreground">
          <span class="font-medium text-foreground">{{ selectedProjectName }}</span> is ready.
          Copy its API token now — it won't be shown again.
        </p>

        <div class="rounded-lg border border-border bg-muted p-3">
          <p class="mb-1 text-xs text-muted-foreground">API token</p>
          <div class="flex items-start gap-2">
            <code class="min-w-0 flex-1 break-all font-mono text-sm">{{ createdToken }}</code>
            <Button
              type="button"
              variant="outline"
              size="icon"
              class="size-7 shrink-0"
              aria-label="Copy API token"
              @click="emit('copy-token')"
            >
              <Copy class="size-3.5" />
            </Button>
          </div>
          <p v-if="tokenCopied" class="mt-1.5 text-xs text-green-400">Copied to clipboard</p>
        </div>
      </div>

      <DialogFooter>
        <template v-if="!createdToken">
          <Button variant="outline" @click="emit('close')">Cancel</Button>
          <Button :disabled="isCreating" @click="emit('create')">
            {{ isCreating ? 'Creating…' : 'Create' }}
          </Button>
        </template>
        <Button v-else @click="emit('close')">Done</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
