<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-colors duration-300">
    <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between transition-colors duration-300">
      <span class="flex items-center">
        <svg class="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        Sons d'ambiance
      </span>
      <button
        @click="toggleMasterSound"
        :class="[
          'p-2 rounded-lg transition-colors',
          masterEnabled ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        ]"
        title="Activer/Désactiver les sons"
      >
        <svg v-if="masterEnabled" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </h3>
    
    <p class="text-xs text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
      Écoute des sons apaisants pour améliorer ta concentration
    </p>
    
    <div class="space-y-3">
      <div
        v-for="sound in sounds"
        :key="sound.id"
        class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
      >
        <div class="flex items-center space-x-3 flex-1">
          <button
            @click="toggleSound(sound.id)"
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center transition-all transform hover:scale-105',
              sound.playing ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600'
            ]"
          >
            <svg v-if="sound.playing" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <span class="text-lg">{{ sound.icon }}</span>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">{{ sound.name }}</p>
            </div>
            
            <!-- Volume slider -->
            <div v-if="sound.playing" class="mt-2 flex items-center space-x-2">
              <svg class="w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              <input
                type="range"
                v-model="sound.volume"
                @input="updateVolume(sound.id)"
                min="0"
                max="100"
                class="flex-1 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer transition-colors duration-300"
              />
              <span class="text-xs text-gray-500 dark:text-gray-400 w-8 text-right transition-colors duration-300">{{ sound.volume }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Info -->
    <div class="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors duration-300">
      <div class="flex items-start space-x-2">
        <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <p class="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed transition-colors duration-300">
          Les sons d'ambiance peuvent t'aider à rester concentré en masquant les distractions environnantes.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  enabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:enabled'])

// État
const masterEnabled = ref(props.enabled)

// Sons disponibles avec simulation (dans une vraie app, on utiliserait de vrais fichiers audio)
const sounds = ref([
  {
    id: 'rain',
    name: 'Pluie',
    icon: '🌧️',
    playing: false,
    volume: 50,
    audio: null
  },
  {
    id: 'forest',
    name: 'Forêt',
    icon: '🌲',
    playing: false,
    volume: 50,
    audio: null
  },
  {
    id: 'ocean',
    name: 'Océan',
    icon: '🌊',
    playing: false,
    volume: 50,
    audio: null
  },
  {
    id: 'cafe',
    name: 'Café',
    icon: '☕',
    playing: false,
    volume: 50,
    audio: null
  },
  {
    id: 'fireplace',
    name: 'Cheminée',
    icon: '🔥',
    playing: false,
    volume: 50,
    audio: null
  },
  {
    id: 'white-noise',
    name: 'Bruit blanc',
    icon: '📻',
    playing: false,
    volume: 50,
    audio: null
  }
])

// Méthodes
const toggleMasterSound = () => {
  masterEnabled.value = !masterEnabled.value
  emit('update:enabled', masterEnabled.value)
  
  if (!masterEnabled.value) {
    // Arrêter tous les sons
    sounds.value.forEach(sound => {
      if (sound.playing) {
        stopSound(sound.id)
      }
    })
  }
}

const toggleSound = (soundId) => {
  if (!masterEnabled.value) {
    masterEnabled.value = true
    emit('update:enabled', true)
  }
  
  const sound = sounds.value.find(s => s.id === soundId)
  if (!sound) return
  
  if (sound.playing) {
    stopSound(soundId)
  } else {
    playSound(soundId)
  }
}

const playSound = (soundId) => {
  const sound = sounds.value.find(s => s.id === soundId)
  if (!sound) return
  
  // Dans une vraie application, on chargerait ici les vrais fichiers audio
  // Pour la démo, on crée un oscillateur avec des fréquences différentes
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Fréquences différentes selon le type de son
    const frequencies = {
      'rain': 200,
      'forest': 150,
      'ocean': 100,
      'cafe': 300,
      'fireplace': 80,
      'white-noise': 250
    }
    
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequencies[soundId] || 150, audioContext.currentTime)
    gainNode.gain.setValueAtTime(sound.volume / 500, audioContext.currentTime) // Volume très bas pour simulation
    
    oscillator.start()
    
    sound.audio = { oscillator, gainNode, audioContext }
    sound.playing = true
    
    const { success } = useToast()
    success(`${sound.icon} ${sound.name}`, 'Son d\'ambiance activé')
  } catch (error) {
    console.error('Erreur lecture audio:', error)
  }
}

const stopSound = (soundId) => {
  const sound = sounds.value.find(s => s.id === soundId)
  if (!sound || !sound.audio) return
  
  try {
    sound.audio.oscillator.stop()
    sound.audio.audioContext.close()
    sound.audio = null
    sound.playing = false
  } catch (error) {
    console.error('Erreur arrêt audio:', error)
  }
}

const updateVolume = (soundId) => {
  const sound = sounds.value.find(s => s.id === soundId)
  if (!sound || !sound.audio) return
  
  try {
    sound.audio.gainNode.gain.setValueAtTime(
      sound.volume / 500,
      sound.audio.audioContext.currentTime
    )
  } catch (error) {
    console.error('Erreur mise à jour volume:', error)
  }
}

// Cleanup
onUnmounted(() => {
  sounds.value.forEach(sound => {
    if (sound.playing) {
      stopSound(sound.id)
    }
  })
})

// Watchers
watch(() => props.enabled, (newVal) => {
  masterEnabled.value = newVal
})
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
