<template>
  <div class="landing-page overflow-x-hidden">
    <!-- Scroll progress bar -->
    <ScrollProgressBar />
    
    <!-- Navigation bar -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300" :class="{ 'shadow-lg': scrolled }">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
              S
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StudyUp
            </span>
          </NuxtLink>

          <!-- Desktop navigation -->
          <div class="hidden md:flex items-center gap-8">
            <a href="#features" @click.prevent="scrollTo('features')" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer">
              Fonctionnalités
            </a>
            <a href="#testimonials" @click.prevent="scrollTo('testimonials')" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer">
              Témoignages
            </a>
            <NuxtLink to="/login" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              Se connecter
            </NuxtLink>
            <button 
              @click="scrollTo('waitlist')"
              class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Rejoindre la bêta
            </button>
            
            <!-- Theme switcher -->
            <button
              @click="toggleDarkMode"
              class="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Toggle dark mode"
            >
              <svg v-if="isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>

          <!-- Mobile menu button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mobile menu -->
        <transition name="slide-down">
          <div v-if="mobileMenuOpen" class="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="flex flex-col gap-4">
              <a href="#features" @click.prevent="scrollToMobile('features')" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer">
                Fonctionnalités
              </a>
              <a href="#testimonials" @click.prevent="scrollToMobile('testimonials')" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer">
                Témoignages
              </a>
              <NuxtLink to="/login" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                Se connecter
              </NuxtLink>
              <button 
                @click="scrollToMobile('waitlist')"
                class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Rejoindre la bêta
              </button>
              <button
                @click="toggleDarkMode"
                class="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                <svg v-if="isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>{{ isDarkMode ? 'Mode clair' : 'Mode sombre' }}</span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </nav>

    <!-- Main content -->
    <main class="pt-20">
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <CTASection />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 dark:bg-black text-white py-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <!-- Brand -->
          <div class="col-span-2">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span class="text-2xl font-bold">StudyUp</span>
            </div>
            <p class="text-gray-400 leading-relaxed">
              L'outil tout-en-un qui aide les étudiants à s'organiser, rester concentrés et progresser sereinement.
            </p>
          </div>

          <!-- Links -->
          <div>
            <h3 class="font-bold mb-4">Produit</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#features" @click.prevent="scrollTo('features')" class="hover:text-white transition-colors cursor-pointer">Fonctionnalités</a></li>
              <li><a href="#testimonials" @click.prevent="scrollTo('testimonials')" class="hover:text-white transition-colors cursor-pointer">Témoignages</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Tarifs</a></li>
              <li><a href="#" class="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="font-bold mb-4">Support</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Confidentialité</a></li>
              <li><a href="#" class="hover:text-white transition-colors">CGU</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-gray-400 text-sm">
            © 2025 StudyUp. Tous droits réservés.
          </p>
          <div class="flex items-center gap-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Scroll to top button -->
    <transition name="fade">
      <button
        v-if="scrolled"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform z-40"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ScrollProgressBar from '@/components/landing/ScrollProgressBar.vue'
import HeroSection from '@/components/landing/HeroSection.vue'
import ProblemSection from '@/components/landing/ProblemSection.vue'
import FeaturesSection from '@/components/landing/FeaturesSection.vue'
import TestimonialsSection from '@/components/landing/TestimonialsSection.vue'
import CTASection from '@/components/landing/CTASection.vue'

definePageMeta({
  layout: false,
  ssr: true
})

// SEO Optimization
useHead({
  title: 'StudyUp - Planifie intelligemment, progresse sereinement',
  meta: [
    { name: 'description', content: 'L\'app qui aide les étudiants à gagner du temps et à rester constants dans leur travail. Synchronisation Pronote, gestion des devoirs, et outils de productivité.' },
    { name: 'keywords', content: 'étudiant, organisation, devoirs, pronote, productivité, études, planning' },
    // Open Graph
    { property: 'og:title', content: 'StudyUp - Planifie intelligemment, progresse sereinement' },
    { property: 'og:description', content: 'L\'app qui aide les étudiants à gagner du temps et à rester constants dans leur travail.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/og-image.jpg' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'StudyUp - Planifie intelligemment, progresse sereinement' },
    { name: 'twitter:description', content: 'L\'app qui aide les étudiants à gagner du temps et à rester constants dans leur travail.' },
    // Theme color
    { name: 'theme-color', content: '#ffffff' },
    { name: 'theme-color', content: '#1f2937', media: '(prefers-color-scheme: dark)' }
  ],
  link: [
    { rel: 'canonical', href: 'https://studyup.com' }
  ]
})

// State
const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const isDarkMode = ref(false)

// Handle scroll
const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

// Smooth scroll to section
const scrollTo = (id) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80 // Account for fixed navbar
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// Smooth scroll for mobile (closes menu)
const scrollToMobile = (id) => {
  mobileMenuOpen.value = false
  setTimeout(() => scrollTo(id), 300)
}

// Scroll to top
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (process.client) {
    document.documentElement.classList.toggle('dark', isDarkMode.value)
    localStorage.setItem('studyup-dark-mode', isDarkMode.value.toString())
  }
}

// Initialize dark mode from localStorage
const initDarkMode = () => {
  if (process.client) {
    const stored = localStorage.getItem('studyup-dark-mode')
    isDarkMode.value = stored === 'true'
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  initDarkMode()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// SEO Meta
useHead({
  title: 'StudyUp - Planifie intelligemment, progresse sereinement',
  meta: [
    {
      name: 'description',
      content: "L'app qui aide les étudiants à gagner du temps et à rester constants dans leur travail. Organisez vos cours, devoirs et sessions d'étude en toute simplicité."
    },
    {
      property: 'og:title',
      content: 'StudyUp - Planifie intelligemment, progresse sereinement'
    },
    {
      property: 'og:description',
      content: "L'app qui aide les étudiants à gagner du temps et à rester constants dans leur travail."
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})
</script>

<style scoped>
.landing-page {
  scroll-behavior: smooth;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Smooth scrolling for the entire page */
html {
  scroll-behavior: smooth;
}

/* Hide scrollbar for better aesthetics */
.landing-page::-webkit-scrollbar {
  width: 8px;
}

.landing-page::-webkit-scrollbar-track {
  background: transparent;
}

.landing-page::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

.landing-page::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}
</style>
