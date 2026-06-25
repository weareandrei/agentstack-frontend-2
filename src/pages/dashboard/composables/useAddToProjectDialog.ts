import { computed, ref } from 'vue'
import { DOCS_API_BASE } from '@/lib/api'
import { useProjects } from './useProjects'

const isRotatingToken = ref(false)
const addToProjectError = ref('')
const tokenCopied = ref(false)
const snippetCopied = ref(false)

export const useAddToProjectDialog = () => {
  const { selectedProject, selectedProjectId, projectTokens, rotateProjectToken } = useProjects()

  const fullProjectToken = computed(() => {
    if (!selectedProjectId.value) return ''
    return projectTokens.value[selectedProjectId.value] ?? ''
  })

  const maskedProjectToken = computed(() => {
    if (!selectedProject.value) return ''
    return `${selectedProject.value.token_prefix}${'•'.repeat(16)}`
  })

  const displayedApiKey = computed(() => fullProjectToken.value || maskedProjectToken.value)

  const ingestSnippet = computed(() => {
    const token = fullProjectToken.value || 'YOUR_PROJECT_TOKEN'
    return `curl -X POST ${DOCS_API_BASE}/ingest \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -d '{ "level": "info", "message": "Hello from my app" }'`
  })

  const handleRotateProjectToken = async () => {
    if (!selectedProjectId.value) return

    isRotatingToken.value = true
    addToProjectError.value = ''
    tokenCopied.value = false
    try {
      await rotateProjectToken(selectedProjectId.value)
    } catch (err) {
      addToProjectError.value = (err as Error).message
    } finally {
      isRotatingToken.value = false
    }
  }

  const copyProjectToken = async () => {
    if (!fullProjectToken.value) return

    try {
      await navigator.clipboard.writeText(fullProjectToken.value)
      tokenCopied.value = true
      window.setTimeout(() => {
        tokenCopied.value = false
      }, 2000)
    } catch {
      addToProjectError.value = 'Could not copy to clipboard'
    }
  }

  const copyIngestSnippet = async () => {
    try {
      await navigator.clipboard.writeText(ingestSnippet.value)
      snippetCopied.value = true
      window.setTimeout(() => {
        snippetCopied.value = false
      }, 2000)
    } catch {
      addToProjectError.value = 'Could not copy to clipboard'
    }
  }

  const resetDialogState = () => {
    addToProjectError.value = ''
    tokenCopied.value = false
    snippetCopied.value = false
  }

  return {
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
  }
}
