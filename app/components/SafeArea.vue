<template>
  <div :class="[
    'safe-area-wrapper',
    noPadding ? '' : 'safe-area-padding'
  ]">
    <slot />
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  noPadding: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
/* Gestion des zones sûres (notch iPhone, barre Android, etc.) */
.safe-area-wrapper {
  width: 100%;
  height: 100%;
}

.safe-area-padding {
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}

/* Support des appareils avec notch */
@supports (padding: max(0px)) {
  .safe-area-padding {
    padding-top: max(env(safe-area-inset-top), 0px);
    padding-right: max(env(safe-area-inset-right), 0px);
    padding-bottom: max(env(safe-area-inset-bottom), 0px);
    padding-left: max(env(safe-area-inset-left), 0px);
  }
}
</style>
