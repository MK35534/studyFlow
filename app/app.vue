<template>
  <div>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
    
    <!-- PWA Install Prompt -->
    <PWAInstallPrompt />
  </div>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";
import { useTheme } from '~/composables/useTheme';
import { onMounted, ref } from 'vue';

const { width } = useWindowSize();

const layout = computed(() => {
  return width.value < 768 ? 'mobile' : 'desktop'
})

// État du dark mode
const isDarkMode = ref(false);

onMounted(() => {
  // Initialiser le thème au montage (côté client uniquement)
  const { isDarkMode: themeDarkMode } = useTheme();
  isDarkMode.value = themeDarkMode.value;
  
  // Appliquer la classe dark si nécessaire
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>