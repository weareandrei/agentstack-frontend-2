<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router.ts'
import { Button } from '@/components/ui/button'
import { isLoggedIn, clearToken } from '@/lib/auth'
import agentstackLogo from '@/assets/agentstack-logo.svg'

const route = useRoute()
const onDashboard = computed(() => route.path.startsWith('/dashboard'))

const signOut = () => {
  clearToken()
  router.push('/sign-in')
}
</script>

<template>
  <nav class="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-2 border-b border-border bg-black px-4">
    <div class="flex items-center gap-2">
      <button
        class="mr-1 flex items-center gap-2 border-none bg-transparent px-2 py-1"
        @click="router.push('/')"
      >
        <img :src="agentstackLogo" width="22" height="22" alt="" aria-hidden="true" />
        <span class="text-[0.95rem] font-bold">AgentStack</span>
      </button>

      <Button variant="ghost" @click="router.push('/docs')">
        Docs
      </Button>
    </div>

    <div class="flex items-center gap-2">
      <template v-if="isLoggedIn">
        <Button v-if="!onDashboard" @click="router.push('/dashboard')">
          Dashboard
        </Button>
        <Button variant="outline" @click="signOut">
          Sign out
        </Button>
      </template>

      <template v-else>
        <Button variant="ghost" @click="router.push('/sign-in')">
          Sign in
        </Button>
        <Button @click="router.push('/sign-up')">
          Sign up
        </Button>
      </template>
    </div>
  </nav>
</template>
