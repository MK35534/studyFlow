<template>
  <section class="relative py-24 bg-white dark:bg-gray-900 overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -right-32 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 -left-32 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6">
      <!-- Section header -->
      <div ref="headerRef" class="text-center mb-16 opacity-0 translate-y-10 transition-all duration-700" :class="{ '!opacity-100 !translate-y-0': headerVisible }">
        <span class="inline-block px-4 py-2 mb-4 text-sm font-semibold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 rounded-full">
          Témoignages
        </span>
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Ce que disent
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            nos étudiants
          </span>
        </h2>
      </div>

      <!-- Testimonials grid -->
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Testimonial 1 -->
        <div ref="testimonial1Ref" class="group p-8 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl border border-gray-200 dark:border-gray-700 hover:scale-105 hover:shadow-2xl transition-all duration-500 opacity-0 translate-y-10" :class="{ '!opacity-100 !translate-y-0': testimonial1Visible }" :style="{ transitionDelay: '100ms' }">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Marie L.</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Terminale S</div>
            </div>
          </div>
          <div class="flex gap-1 mb-4">
            <span v-for="i in 5" :key="i" class="text-yellow-400">⭐</span>
          </div>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            "J'ai enfin trouvé un outil qui me <strong>simplifie vraiment la vie</strong>. Plus besoin de jongler entre 10 apps. Tout est là, clair et efficace. 🎯"
          </p>
        </div>

        <!-- Testimonial 2 -->
        <div ref="testimonial2Ref" class="group p-8 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-3xl border border-gray-200 dark:border-gray-700 hover:scale-105 hover:shadow-2xl transition-all duration-500 opacity-0 translate-y-10" :class="{ '!opacity-100 !translate-y-0': testimonial2Visible }" :style="{ transitionDelay: '200ms' }">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Thomas B.</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">1ère année Licence</div>
            </div>
          </div>
          <div class="flex gap-1 mb-4">
            <span v-for="i in 5" :key="i" class="text-yellow-400">⭐</span>
          </div>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            "Le mode Focus est <strong>un game changer</strong>. Je reste concentré 2x plus longtemps et je procrastine beaucoup moins. Merci StudyUp ! 🚀"
          </p>
        </div>

        <!-- Testimonial 3 -->
        <div ref="testimonial3Ref" class="group p-8 bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-pink-900/20 rounded-3xl border border-gray-200 dark:border-gray-700 hover:scale-105 hover:shadow-2xl transition-all duration-500 opacity-0 translate-y-10" :class="{ '!opacity-100 !translate-y-0': testimonial3Visible }" :style="{ transitionDelay: '300ms' }">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Sarah K.</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Seconde</div>
            </div>
          </div>
          <div class="flex gap-1 mb-4">
            <span v-for="i in 5" :key="i" class="text-yellow-400">⭐</span>
          </div>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            "La sync Pronote est <strong>magique</strong> ! Tous mes devoirs apparaissent automatiquement. Je ne rate plus aucune deadline. 📚✨"
          </p>
        </div>

        <!-- Testimonial 4 -->
        <div class="group p-8 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20 rounded-3xl border border-gray-200 dark:border-gray-700 hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              L
            </div>
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Lucas D.</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Terminale ES</div>
            </div>
          </div>
          <div class="flex gap-1 mb-4">
            <span v-for="i in 5" :key="i" class="text-yellow-400">⭐</span>
          </div>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            "Interface <strong>ultra intuitive</strong>, design moderne et fonctionnalités bien pensées. C'est exactement ce dont j'avais besoin. 💯"
          </p>
        </div>

        <!-- Testimonial 5 -->
        <div class="group p-8 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 rounded-3xl border border-gray-200 dark:border-gray-700 hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              E
            </div>
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Emma R.</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">2ème année Prépa</div>
            </div>
          </div>
          <div class="flex gap-1 mb-4">
            <span v-for="i in 5" :key="i" class="text-yellow-400">⭐</span>
          </div>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            "Même avec un emploi du temps de fou, je reste <strong>organisée et sereine</strong> grâce à StudyUp. Un vrai boost de productivité ! 💪"
          </p>
        </div>

        <!-- Testimonial 6 -->
        <div class="group p-8 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/20 rounded-3xl border border-gray-200 dark:border-gray-700 hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Alexandre M.</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">1ère STI2D</div>
            </div>
          </div>
          <div class="flex gap-1 mb-4">
            <span v-for="i in 5" :key="i" class="text-yellow-400">⭐</span>
          </div>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            "Mes notes ont littéralement <strong>décollé</strong> depuis que j'utilise StudyUp. Je planifie mieux et je travaille plus efficacement. 📈"
          </p>
        </div>
      </div>

      <!-- Trust indicators -->
      <div class="mt-16 text-center">
        <p class="text-gray-600 dark:text-gray-400 mb-6">Ils nous font confiance :</p>
        <div class="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div class="text-2xl font-bold text-gray-400">🎓 Lycée Henri IV</div>
          <div class="text-2xl font-bold text-gray-400">🎓 Lycée Louis-le-Grand</div>
          <div class="text-2xl font-bold text-gray-400">🎓 Université Paris-Saclay</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const headerRef = ref(null)
const testimonial1Ref = ref(null)
const testimonial2Ref = ref(null)
const testimonial3Ref = ref(null)

const headerVisible = ref(false)
const testimonial1Visible = ref(false)
const testimonial2Visible = ref(false)
const testimonial3Visible = ref(false)

const observer = ref(null)

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === headerRef.value) headerVisible.value = true
          else if (entry.target === testimonial1Ref.value) testimonial1Visible.value = true
          else if (entry.target === testimonial2Ref.value) testimonial2Visible.value = true
          else if (entry.target === testimonial3Ref.value) testimonial3Visible.value = true
        }
      })
    },
    { threshold: 0.1 }
  )

  if (headerRef.value) observer.value.observe(headerRef.value)
  if (testimonial1Ref.value) observer.value.observe(testimonial1Ref.value)
  if (testimonial2Ref.value) observer.value.observe(testimonial2Ref.value)
  if (testimonial3Ref.value) observer.value.observe(testimonial3Ref.value)
})

onUnmounted(() => {
  if (observer.value) observer.value.disconnect()
})
</script>
