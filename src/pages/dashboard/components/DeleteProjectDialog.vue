<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

defineProps<{
  open: boolean
  deleteProjectName: string
  deleteError: string
  isDeleting: boolean
}>()

const emit = defineEmits<{
  'update:open': [open: boolean]
  submit: []
  close: []
}>()
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete project</DialogTitle>
      </DialogHeader>

      <div class="grid gap-4 py-2">
        <p class="text-sm text-muted-foreground">
          Delete
          <span class="font-medium text-foreground">{{ deleteProjectName }}</span>?
          All logs in this project will be permanently removed.
        </p>

        <p v-if="deleteError" class="text-sm text-red-400">{{ deleteError }}</p>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('close')">Cancel</Button>
        <Button variant="destructive" :disabled="isDeleting" @click="emit('submit')">
          {{ isDeleting ? 'Deleting…' : 'Delete project' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
