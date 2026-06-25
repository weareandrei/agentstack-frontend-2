<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue'
import Navigation from '@/Navigation.vue'
</script>

<template>
  <Navigation />
  <router-view />
  <Analytics />
</template>
