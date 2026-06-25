<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { cn } from '@/lib/utils'
import { Copy, RefreshCw, ExternalLink } from '@lucide/vue'
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
import { useAddToProjectDialog } from '../composables/useAddToProjectDialog'

const props = defineProps<{
  open: boolean
  onClose: () => void
}>()

const {
  selectedProject,
  displayedApiKey,
  fullProjectToken,
  ingestSnippet,
  isRotatingToken,
  addToProjectError,
  tokenCopied,
  snippetCopied,
  resetDialogState,
  handleRotateProjectToken,
  copyProjectToken,
  copyIngestSnippet,
} = useAddToProjectDialog()

const handleClose = () => {
  resetDialogState()
  props.onClose()
}

const handleOpenChange = (open: boolean) => {
  if (!open) handleClose()
}
</script>

<template>
  <Dialog v-if="selectedProject" :open="open" @update:open="handleOpenChange">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle>Add to my project</DialogTitle>
      </DialogHeader>

      <div class="grid gap-4 py-2">
        <p class="text-sm text-muted-foreground">
          Use this API key to send or read logs for
          <span class="font-medium text-foreground">{{ selectedProject.name }}</span>.
        </p>

        <div class="grid gap-2">
          <Label for="api-key">API key</Label>
          <div class="flex gap-2">
            <Input
              id="api-key"
              :model-value="displayedApiKey"
              readonly
              class="font-mono text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              :disabled="isRotatingToken"
              aria-label="Roll API key"
              @click="handleRotateProjectToken"
            >
              <RefreshCw :class="cn('size-4', isRotatingToken && 'animate-spin')" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              :disabled="!fullProjectToken"
              aria-label="Copy API key"
              @click="copyProjectToken"
            >
              <Copy class="size-4" />
            </Button>
          </div>
          <p class="text-xs text-muted-foreground">
            <template v-if="fullProjectToken">
              Full key visible — copy it now. Roll to generate a new one anytime.
            </template>
            <template v-else>
              Roll the key to reveal and copy the full token.
            </template>
          </p>
          <p v-if="tokenCopied" class="text-xs text-green-400">Copied to clipboard</p>
        </div>

        <div class="grid gap-2">
          <Label>Quick start</Label>
          <div class="relative rounded-lg border border-border bg-muted">
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              class="absolute right-1.5 top-1.5 z-10 shadow-sm"
              :aria-label="snippetCopied ? 'Copied' : 'Copy curl command'"
              @click="copyIngestSnippet"
            >
              <Copy class="size-3.5" />
            </Button>
            <pre class="overflow-x-auto p-3 pr-11"><code class="font-mono text-[0.75rem] leading-relaxed">{{ ingestSnippet }}</code></pre>
          </div>
          <p v-if="snippetCopied" class="text-xs text-green-400">Copied to clipboard</p>
        </div>

        <RouterLink
          to="/docs"
          class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          @click="handleClose"
        >
          Read the full API docs
          <ExternalLink class="size-3.5" />
        </RouterLink>

        <p v-if="addToProjectError" class="text-sm text-red-400">{{ addToProjectError }}</p>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleClose">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
