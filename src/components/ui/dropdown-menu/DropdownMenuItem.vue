<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DropdownMenuItem, type DropdownMenuItemEmits, type DropdownMenuItemProps, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuItemProps & { class?: HTMLAttributes['class']; inset?: boolean }>()
const emits = defineEmits<DropdownMenuItemEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DropdownMenuItem
    v-bind="forwarded"
    :class="
      cn(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        inset && 'pl-8',
        props.class,
      )
    "
  >
    <slot />
  </DropdownMenuItem>
</template>
