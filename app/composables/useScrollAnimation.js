import { onMounted, onUnmounted } from 'vue'

export const useScrollAnimation = () => {
  let observer = null

  const initScrollAnimation = () => {
    if (process.client) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-visible')
              // Unobserve after animation to improve performance
              observer.unobserve(entry.target)
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      )

      // Observe all elements with animate-on-scroll class
      const elements = document.querySelectorAll('.animate-on-scroll')
      elements.forEach((el) => observer.observe(el))
    }
  }

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
    }
  }

  onMounted(() => {
    initScrollAnimation()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    initScrollAnimation,
    cleanup
  }
}
