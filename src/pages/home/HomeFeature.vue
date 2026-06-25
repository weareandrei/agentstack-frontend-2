<script setup lang="ts">
defineProps<{
  title: string
  body: string
}>()
</script>

<template>
  <div
    class="rounded-xl border border-border bg-card/40 p-5 text-left transition-colors hover:bg-card/70"
  >
    <span class="grid size-9 place-items-center rounded-lg bg-muted">
      <slot />
    </span>
    <h3 class="mt-3 text-sm font-semibold">{{ title }}</h3>
    <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{{ body }}</p>
  </div>
</template>
