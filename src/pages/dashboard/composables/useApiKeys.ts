import { computed, onMounted, ref } from 'vue'
import ALGORITHM from '@/lib/algorithm'
import { DOCS_API_BASE } from '@/lib/api'

export interface AccountApiKey {
  api_key_prefix: string | null
  has_key: boolean
}

const apiKeyInfo = ref<AccountApiKey | null>(null)
const fullApiKey = ref('')
const errorMessage = ref('')
const isLoading = ref(true)
const isRotating = ref(false)
const tokenCopied = ref(false)
const briefCopied = ref(false)

export const useApiKeys = () => {
  const docsUrl = computed(() => `${window.location.origin}/docs`)

  const maskedApiKey = computed(() => {
    if (!apiKeyInfo.value?.api_key_prefix) return ''
    return `${apiKeyInfo.value.api_key_prefix}${'•'.repeat(16)}`
  })

  const displayedApiKey = computed(() => fullApiKey.value || maskedApiKey.value)

  const agentBrief = computed(() => {
    const key = fullApiKey.value || 'YOUR_AGENT_API_KEY'
    return `Use AgentStack to record and read structured logs.

API base: ${DOCS_API_BASE}
API key: ${key}
Check out API documentation: ${docsUrl.value}`
  })

  const loadApiKey = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      apiKeyInfo.value = await ALGORITHM.getAccountApiKey()
    } catch (err) {
      errorMessage.value = (err as Error).message
    } finally {
      isLoading.value = false
    }
  }

  const rotateApiKey = async () => {
    errorMessage.value = ''
    tokenCopied.value = false
    isRotating.value = true
    try {
      const result = await ALGORITHM.rotateAccountApiKey()
      apiKeyInfo.value = {
        api_key_prefix: result.api_key_prefix,
        has_key: true,
      }
      fullApiKey.value = result.token
    } catch (err) {
      errorMessage.value = (err as Error).message
    } finally {
      isRotating.value = false
    }
  }

  const copyApiKey = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token)
      tokenCopied.value = true
      window.setTimeout(() => {
        tokenCopied.value = false
      }, 2000)
    } catch {
      errorMessage.value = 'Could not copy to clipboard'
    }
  }

  const copyAgentBrief = async (brief: string) => {
    try {
      await navigator.clipboard.writeText(brief)
      briefCopied.value = true
      window.setTimeout(() => {
        briefCopied.value = false
      }, 2000)
    } catch {
      errorMessage.value = 'Could not copy to clipboard'
    }
  }

  onMounted(() => {
    void loadApiKey()
  })

  return {
    apiKeyInfo,
    fullApiKey,
    errorMessage,
    isLoading,
    isRotating,
    tokenCopied,
    briefCopied,
    docsUrl,
    maskedApiKey,
    displayedApiKey,
    agentBrief,
    loadApiKey,
    rotateApiKey,
    copyApiKey,
    copyAgentBrief,
  }
}
