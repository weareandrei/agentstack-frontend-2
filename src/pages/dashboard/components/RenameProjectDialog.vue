<script setup lang="ts">
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
  renameProjectName: string
  renameError: string
  isRenaming: boolean
}>()

const emit = defineEmits<{
  'update:open': [open: boolean]
  'update:renameProjectName': [name: string]
  submit: []
  close: []
}>()
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Rename project</DialogTitle>
      </DialogHeader>

      <div class="grid gap-4 py-2">
        <div class="grid gap-2">
          <Label for="rename-project-name">Project name</Label>
          <Input
            id="rename-project-name"
            :model-value="renameProjectName"
            placeholder="My project"
            @update:model-value="emit('update:renameProjectName', String($event))"
            @keyup.enter="emit('submit')"
          />
        </div>

        <p v-if="renameError" class="text-sm text-red-400">{{ renameError }}</p>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('close')">Cancel</Button>
        <Button :disabled="isRenaming" @click="emit('submit')">
          {{ isRenaming ? 'Saving…' : 'Save' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
