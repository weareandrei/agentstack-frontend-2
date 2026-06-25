import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ALGORITHM from '@/lib/algorithm'
import { setTokens } from '@/lib/auth'

export const useSignIn = () => {
  const router = useRouter()
  const route = useRoute()

  const email = ref('')
  const password = ref('')
  const isLoading = ref(false)
  const errorMessage = ref('')

  const onSubmit = async () => {
    errorMessage.value = ''

    isLoading.value = true
    try {
      const data = await ALGORITHM.login(email.value, password.value)
      setTokens(data.access_token, data.refresh_token)
      const redirect =
        typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
      router.push(redirect)
    } catch (err) {
      errorMessage.value = (err as Error).message
    } finally {
      isLoading.value = false
    }
  }

  return {
    email,
    password,
    isLoading,
    errorMessage,
    onSubmit,
  }
}
