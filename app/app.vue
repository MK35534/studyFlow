<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- PWA Install Prompt -->
    <PWAInstallPrompt />
  </div>
</template>

<script setup>
import { useTheme } from '~/composables/useTheme';
import { onMounted, ref } from 'vue';

// Configuration du manifest PWA
useHead({
  link: [
    {
      rel: 'manifest',
      href: '/manifest.webmanifest'
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/icons/icon-192x192.png'
    }
  ],
  meta: [
    {
      name: 'theme-color',
      content: '#3b82f6'
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default'
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes'
    }
  ]
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