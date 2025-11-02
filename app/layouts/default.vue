<template>
  <div>
    <component :is="currentLayout">
      <slot />
    </component>
  </div>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core"
import { computed } from 'vue'
import DesktopLayout from './desktop.vue'
import MobileLayout from './mobile.vue'

const { width } = useWindowSize()

const currentLayout = computed(() => {
  return width.value < 768 ? MobileLayout : DesktopLayout
})
</script>
