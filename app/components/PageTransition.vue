<template>
  <Transition
    name="page"
    mode="out-in"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
  >
    <div :key="route.fullPath" class="page-container">
      <slot />
    </div>
  </Transition>
</template>

<script setup>
import { nextTick } from 'vue'

const route = useRoute()

// Animations personnalisées
const onBeforeEnter = (el) => {
  el.style.opacity = '0'
  el.style.transform = 'translateX(20px)'
}

const onEnter = async (el) => {
  await nextTick()
  el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  el.style.opacity = '1'
  el.style.transform = 'translateX(0)'
}

const onLeave = (el) => {
  el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  el.style.opacity = '0'
  el.style.transform = 'translateX(-20px)'
}
</script>

<style scoped>
.page-container {
  min-height: 100%;
}
</style>