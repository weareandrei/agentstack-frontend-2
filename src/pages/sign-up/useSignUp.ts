import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ALGORITHM from '@/lib/algorithm'

export const useSignUp = () => {
  const router = useRouter()

  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const isLoading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  const onSubmit = async () => {
    errorMessage.value = ''
    successMessage.value = ''

    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Passwords do not match.'
      return
    }

    isLoading.value = true
    try {
      await ALGORITHM.createAccount(email.value, password.value)

      successMessage.value = 'Account created. Redirecting to sign in…'
      router.push('/sign-in')
    } catch (err) {
      errorMessage.value = (err as Error).message
    } finally {
      isLoading.value = false
    }
  }

  return {
    email,
    password,
    confirmPassword,
    isLoading,
    errorMessage,
    successMessage,
    onSubmit,
  }
}
