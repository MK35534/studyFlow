<template>
  <div v-if="show" class="ent-webview-overlay">
    <div class="ent-webview-container">
      <!-- Header -->
      <div class="webview-header">
        <div class="flex items-center gap-3">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">Connexion via ENT</h3>
            <p class="text-sm text-blue-200">{{ instanceName }}</p>
          </div>
        </div>
        <button @click="closeWebView" class="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p class="text-gray-600 dark:text-gray-400 mt-4">
          {{ loadingMessage }}
        </p>
      </div>

      <!-- Instructions simplifiées -->
      <div v-if="!loading && !authenticated && !showUrlInput" class="instructions">
        <div class="instruction-card">
          <span class="step-number">1</span>
          <p>Ouvrir une nouvelle fenêtre et aller sur votre Pronote</p>
        </div>
        <div class="instruction-card">
          <span class="step-number">2</span>
          <p>Se connecter via l'ENT (vous serez redirigé vers Atrium Sud)</p>
        </div>
        <div class="instruction-card">
          <span class="step-number">3</span>
          <p>Une fois sur l'interface Pronote, copier l'URL complète</p>
        </div>
        <div class="instruction-card">
          <span class="step-number">4</span>
          <p>Revenir ici et coller l'URL dans le champ ci-dessous</p>
        </div>
        
        <button @click="showUrlInput = true" class="open-popup-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Je suis prêt à coller l'URL
        </button>
      </div>

      <!-- Champ pour coller l'URL -->
      <div v-if="showUrlInput && !authenticated" class="url-input-section">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Collez l'URL de Pronote après connexion
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          L'URL doit ressembler à : <br>
          <code class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            https://xxxxx.index-education.net/pronote/eleve.html?identifiant=xxxxx
          </code>
        </p>
        
        <div class="flex flex-col gap-3">
          <textarea
            v-model="pastedUrl"
            placeholder="https://0830050d.index-education.net/pronote/eleve.html?identifiant=..."
            rows="3"
            class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          ></textarea>
          
          <div class="flex gap-2">
            <button @click="validatePastedUrl" :disabled="!pastedUrl.trim()" class="validate-btn flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Valider l'URL
            </button>
            <button @click="showUrlInput = false; pastedUrl = ''" class="cancel-btn">
              Annuler
            </button>
          </div>
        </div>
      </div>

      <!-- Info popup bloquée -->
      <div v-if="loadingMessage.includes('Popup bloquée')" class="popup-blocked-warning">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>{{ loadingMessage }}</p>
        <button @click="openPopupWindow" class="retry-btn">
          Réessayer
        </button>
      </div>

      <!-- Success State -->
      <div v-if="authenticated" class="success-state">
        <div class="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <p class="text-xl font-bold text-gray-900 dark:text-white mt-4">
          Authentification réussie !
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Fermeture automatique dans {{ countdown }}s...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  casUrl: {
    type: String,
    required: true
  },
  pronoteUrl: {
    type: String,
    required: false,
    default: ''
  },
  instanceName: {
    type: String,
    default: 'Pronote'
  }
});

const emit = defineEmits(['close', 'authenticated']);

const iframeRef = ref(null);
const loading = ref(false);
const loadingMessage = ref('Chargement de la page de connexion...');
const authenticated = ref(false);
const countdown = ref(3);
const checkInterval = ref(null);
const countdownInterval = ref(null);
const popupWindow = ref(null);
const showUrlInput = ref(false);
const pastedUrl = ref('');

// 🔥 Écouteur de messages de la popup (comme Papillon écoute les messages de la WebView)
function handlePopupMessage(event) {
  // Sécurité: vérifie l'origine du message (optionnel mais recommandé)
  // if (event.origin !== 'https://expected-origin.com') return;
  
  const message = event.data;
  
  if (message && message.type === 'ent.pronoteUrlDetected') {
    console.log('[ENT Auth] 📨 Message reçu: URL Pronote détectée:', message.url);
    
    // Ferme la popup et traite l'authentification
    if (popupWindow.value && !popupWindow.value.closed) {
      popupWindow.value.close();
    }
    
    handleSuccessfulAuth(message.url);
  }
  
  if (message && message.type === 'ent.windowClosing') {
    console.log('[ENT Auth] 📨 Message reçu: Fenêtre en cours de fermeture, URL:', message.url);
    
    // Si l'URL contient Pronote, traite l'authentification
    if (message.url && (message.url.includes('pronote') || message.url.includes('index-education'))) {
      handleSuccessfulAuth(message.url);
    }
  }
}

// 🔥 Validation de l'URL collée par l'utilisateur (approche simple et efficace)
async function validatePastedUrl() {
  const url = pastedUrl.value.trim();
  
  if (!url) {
    loadingMessage.value = '⚠️ Veuillez coller une URL';
    return;
  }

  loading.value = true;
  loadingMessage.value = 'Vérification de l\'URL...';

  try {
    // Vérifie que c'est bien une URL Pronote
    if (!url.includes('pronote') && !url.includes('index-education')) {
      loadingMessage.value = '⚠️ Cette URL ne semble pas être une URL Pronote valide.';
      loading.value = false;
      return;
    }

    console.log('[ENT Auth] 🎯 URL collée par l\'utilisateur:', url);
    
    // Vérifie qu'il y a un token dans l'URL
    const urlParams = new URL(url).searchParams;
    const hasToken = urlParams.get('identifiant') || 
                     urlParams.get('ticket') || 
                     urlParams.get('SAMLart') || 
                     urlParams.get('token');
    
    if (!hasToken) {
      loadingMessage.value = '⚠️ Cette URL ne contient pas de token d\'authentification. Assurez-vous de copier l\'URL APRÈS connexion.';
      loading.value = false;
      return;
    }

    console.log('[ENT Auth] ✅ Token trouvé dans l\'URL collée');
    
    // Traite l'authentification
    await handleSuccessfulAuth(url);
  } catch (error) {
    console.error('[ENT Auth] ❌ Erreur lors de la validation de l\'URL:', error);
    loadingMessage.value = '⚠️ URL invalide. Vérifiez le format de l\'URL.';
    loading.value = false;
  }
}

// Ouvre une fenêtre popup au lieu d'une iframe
function openPopupWindow() {
  const width = 800;
  const height = 700;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  
  // 🔥 Ouvre directement l'URL Pronote (pas l'ENT) - Pronote redirigera vers l'ENT automatiquement
  const urlToOpen = props.pronoteUrl || props.casUrl;
  
  console.log('[ENT Auth] 🚀 Ouverture de la popup sur:', urlToOpen);
  console.log('[ENT Auth] 💡 Pronote va rediriger automatiquement vers l\'ENT pour authentification');
  
  popupWindow.value = window.open(
    urlToOpen,
    'ENT_Authentication',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
  );
  
  if (!popupWindow.value) {
    loadingMessage.value = '⚠️ Popup bloquée ! Autorisez les popups pour ce site.';
    return;
  }
  
  loading.value = false;
  
  // 🔥 Override window.open dans la popup pour capturer les nouvelles fenêtres
  try {
    // Injecte un intercepteur dès l'ouverture
    const checkDocumentReady = setInterval(() => {
      try {
        if (popupWindow.value.document && popupWindow.value.document.body) {
          clearInterval(checkDocumentReady);
          injectWindowOpenInterceptor();
        }
      } catch (e) {
        // Cross-origin, on attendra
      }
    }, 100);
  } catch (e) {
    console.log('[ENT Auth] Impossible d\'injecter l\'intercepteur immédiatement');
  }
  
  // Surveille la popup
  if (!checkInterval.value) {
    checkInterval.value = setInterval(() => {
      checkPopupAuthentication();
    }, 500);
  }
}

// 🔥 Injecte un intercepteur inspiré de Papillon - surveille l'état de connexion
function injectWindowOpenInterceptor() {
  try {
    if (!popupWindow.value || !popupWindow.value.document) return;
    
    const script = popupWindow.value.document.createElement('script');
    script.id = 'ent-window-interceptor';
    script.textContent = `
      (function() {
        console.log('[ENT] ✅ Script d\\'interception installé (inspiré de Papillon)');
        
        // 1. Surveille les changements d'URL toutes les 500ms (comme Papillon surveille loginState)
        setInterval(function() {
          const currentUrl = window.location.href;
          
          // Si on détecte Pronote dans l'URL, on envoie un message à la fenêtre parente
          if (currentUrl.includes('pronote') || currentUrl.includes('index-education')) {
            console.log('[ENT] 🎯 URL Pronote détectée:', currentUrl);
            
            // Envoie un message à window.opener (comme Papillon utilise postMessage)
            if (window.opener && !window.opener.closed) {
              window.opener.postMessage({
                type: 'ent.pronoteUrlDetected',
                url: currentUrl
              }, '*');
              
              console.log('[ENT] ✉️ Message envoyé à window.opener');
            }
          }
        }, 500);
        
        // 2. Intercepte beforeunload pour capturer l'URL finale
        window.addEventListener('beforeunload', function() {
          const finalUrl = window.location.href;
          console.log('[ENT] Fenêtre en cours de fermeture, URL finale:', finalUrl);
          
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
              type: 'ent.windowClosing',
              url: finalUrl
            }, '*');
          }
        });
        
        // 3. Override window.open pour forcer navigation dans la même fenêtre
        const originalOpen = window.open;
        window.open = function(url, name, features) {
          console.log('[ENT] ⚡ window.open intercepté, navigation dans la même fenêtre:', url);
          
          if (url) {
            window.location.href = url;
            return window;
          }
          
          return originalOpen.call(window, url, name, features);
        };
        
        // 4. Intercepte les clics sur liens target="_blank"
        document.addEventListener('click', function(e) {
          let target = e.target;
          
          // Remonte jusqu'au lien
          while (target && target.tagName !== 'A') {
            target = target.parentElement;
          }
          
          if (target && target.tagName === 'A' && target.target === '_blank') {
            const href = target.href;
            if (href) {
              e.preventDefault();
              e.stopPropagation();
              console.log('[ENT] ⚡ Lien _blank intercepté, navigation dans la même fenêtre:', href);
              window.location.href = href;
            }
          }
        }, true);
      })();
    `;
    
    popupWindow.value.document.head.appendChild(script);
    console.log('[ENT Auth] ✅ Intercepteur Papillon-like injecté dans la popup');
  } catch (error) {
    console.error('[ENT Auth] ❌ Erreur injection intercepteur:', error);
  }
}

// Vérifie l'authentification via la popup
function checkPopupAuthentication() {
  if (!popupWindow.value) {
    return;
  }
  
  // Détecte si la popup est fermée
  if (popupWindow.value.closed) {
    clearInterval(checkInterval.value);
    loading.value = false;
    loadingMessage.value = 'Fenêtre fermée. Réessayez l\'authentification.';
    return;
  }

  // 🔥 Essaie d'accéder à l'URL de la popup pour détecter Pronote
  try {
    const popupUrl = popupWindow.value.location.href;
    
    // Si on arrive sur une URL Pronote avec un token CAS, on a réussi !
    if (popupUrl && (popupUrl.includes('pronote') || popupUrl.includes('index-education'))) {
      console.log('[ENT Auth] 🎯 URL Pronote détectée depuis parent:', popupUrl);
      
      // Vérifie s'il y a un token dans l'URL (identifiant, ticket, etc.)
      const urlParams = new URL(popupUrl).searchParams;
      const hasToken = urlParams.get('identifiant') || 
                       urlParams.get('ticket') || 
                       urlParams.get('SAMLart') || 
                       urlParams.get('token');
      
      if (hasToken) {
        console.log('[ENT Auth] ✅ Token CAS trouvé dans l\'URL !');
        
        // Ferme la popup et traite l'authentification
        if (popupWindow.value && !popupWindow.value.closed) {
          popupWindow.value.close();
        }
        
        handleSuccessfulAuth(popupUrl);
        return;
      } else {
        console.log('[ENT Auth] ⏳ Sur Pronote mais pas de token dans l\'URL - attente de l\'authentification ENT...');
      }
    }
    
    // 🔥 Réinjecte le script si on peut accéder au document
    const popupDoc = popupWindow.value.document;
    if (popupDoc && popupDoc.body && !popupDoc.getElementById('ent-window-interceptor')) {
      injectWindowOpenInterceptor();
      console.log('[ENT Auth] 🔄 Script réinjecté suite à changement de page');
    }
  } catch (error) {
    // Cross-origin, on ne peut pas accéder à l'URL (normal pendant la navigation ENT)
    // Le script injecté dans la popup continuera à surveiller et enverra un postMessage
  }
}

// Surveille les changements d'URL dans l'iframe pour détecter l'authentification
function handleIframeLoad() {
  loading.value = false;
  
  // Démarre la surveillance de l'authentification
  if (!checkInterval.value) {
    checkInterval.value = setInterval(() => {
      checkAuthentication();
    }, 500);
  }
}

// Vérifie si l'utilisateur s'est authentifié
async function checkAuthentication() {
  try {
    const iframe = iframeRef.value;
    if (!iframe) return;

    // Tente d'accéder à l'URL de l'iframe (fonctionne uniquement si same-origin)
    try {
      const iframeUrl = iframe.contentWindow.location.href;
      
      // Détecte si on est revenu sur une page Pronote (signe d'authentification réussie)
      if (iframeUrl.includes('pronote') || iframeUrl.includes('index-education')) {
        await handleSuccessfulAuth(iframeUrl);
      }
    } catch (error) {
      // Cross-origin - on ne peut pas accéder à l'URL
      // C'est normal pendant l'auth ENT
    }

    // Alternative : Injecter un script dans l'iframe pour capturer les cookies
    // (Fonctionne uniquement si same-origin après redirect)
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Vérifie si on est sur une page Pronote
      if (iframeDoc && iframeDoc.location.href.includes('pronote')) {
        const cookies = iframeDoc.cookie;
        if (cookies && cookies.includes('pronote')) {
          await handleSuccessfulAuth(iframeDoc.location.href, cookies);
        }
      }
    } catch (error) {
      // Ignore les erreurs cross-origin
    }

  } catch (error) {
    console.error('Error checking authentication:', error);
  }
}

// Gère l'authentification réussie
async function handleSuccessfulAuth(returnUrl, cookies = null) {
  if (authenticated.value) return; // Évite les doubles appels

  clearInterval(checkInterval.value);
  loading.value = true;
  loadingMessage.value = 'Extraction des credentials...';

  try {
    // Extrait le token CAS de l'URL ou des cookies
    const casToken = extractCASToken(returnUrl, cookies);
    
    if (casToken) {
      authenticated.value = true;
      loading.value = false;
      
      // Émet l'événement avec le token
      emit('authenticated', {
        casToken,
        returnUrl,
        cookies
      });

      // Démarre le compte à rebours avant fermeture
      startCountdown();
    }
  } catch (error) {
    console.error('Error handling authentication:', error);
    loading.value = false;
  }
}

// Extrait le token CAS de l'URL ou des cookies
function extractCASToken(url, cookies) {
  // Méthode 1: Depuis l'URL (paramètres courants)
  const urlParams = new URL(url).searchParams;
  
  // Essaie différents noms de paramètres utilisés par les ENT
  const ticket = urlParams.get('ticket') || 
                 urlParams.get('SAMLart') || 
                 urlParams.get('identifiant') ||  // ← Ajouté pour Atrium Sud
                 urlParams.get('token');
  
  if (ticket) {
    console.log('[ENT Auth] 🎟️ Token CAS extrait depuis l\'URL:', ticket);
    return ticket;
  }

  // Méthode 2: Depuis les cookies
  if (cookies) {
    const casMatch = cookies.match(/CAS_TICKET=([^;]+)/);
    if (casMatch) {
      console.log('[ENT Auth] 🍪 Token CAS extrait depuis les cookies:', casMatch[1]);
      return casMatch[1];
    }
  }

  // Méthode 3: Token dans le hash
  const hashMatch = url.match(/#.*token=([^&]+)/);
  if (hashMatch) {
    console.log('[ENT Auth] # Token CAS extrait depuis le hash:', hashMatch[1]);
    return hashMatch[1];
  }

  console.warn('[ENT Auth] ⚠️ Aucun token CAS trouvé dans l\'URL:', url);
  return null;
}

// Démarre le compte à rebours
function startCountdown() {
  countdownInterval.value = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownInterval.value);
      closeWebView();
    }
  }, 1000);
}

// Ferme la WebView
function closeWebView() {
  clearInterval(checkInterval.value);
  clearInterval(countdownInterval.value);
  
  // Ferme la popup si elle est ouverte
  if (popupWindow.value && !popupWindow.value.closed) {
    popupWindow.value.close();
  }
  
  emit('close');
}

// Nettoyage
onUnmounted(() => {
  clearInterval(checkInterval.value);
  clearInterval(countdownInterval.value);
  
  // Ferme la popup si elle existe
  if (popupWindow.value && !popupWindow.value.closed) {
    popupWindow.value.close();
  }
});

// Réinitialise l'état quand la modal se ferme
watch(() => props.show, (newVal) => {
  if (newVal) {
    loading.value = false;  // Pas de loading au début, on attend le clic
    authenticated.value = false;
    countdown.value = 3;
    loadingMessage.value = 'Cliquez sur le bouton pour ouvrir la fenêtre d\'authentification';
  } else {
    clearInterval(checkInterval.value);
    clearInterval(countdownInterval.value);
    
    // Ferme la popup
    if (popupWindow.value && !popupWindow.value.closed) {
      popupWindow.value.close();
    }
  }
});
</script>

<style scoped>
.ent-webview-overlay {
  @apply fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4;
}

.ent-webview-container {
  @apply w-full max-w-4xl h-[85vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col;
}

.webview-header {
  @apply flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600;
}

.icon-wrapper {
  @apply w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white;
}

.close-btn {
  @apply w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all;
}

.loading-state {
  @apply flex-1 flex flex-col items-center justify-center p-8;
}

.spinner {
  @apply w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin;
}

.instructions {
  @apply p-6 space-y-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800;
}

.instruction-card {
  @apply flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300;
}

.step-number {
  @apply w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0;
}

.open-popup-btn {
  @apply w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2;
}

.manual-validation {
  @apply p-6 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800;
}

.validate-btn {
  @apply px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.cancel-btn {
  @apply px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all;
}

.url-input-section {
  @apply p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700;
}

.popup-blocked-warning {
  @apply flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4;
}

.popup-blocked-warning svg {
  @apply text-orange-500 w-16 h-16;
}

.popup-blocked-warning p {
  @apply text-lg text-gray-700 dark:text-gray-300;
}

.retry-btn {
  @apply px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all;
}

.webview-frame {
  @apply flex-1 p-4 overflow-hidden;
}

.success-state {
  @apply flex-1 flex flex-col items-center justify-center p-8;
}

.success-icon {
  @apply w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.ent-webview-container {
  animation: fadeIn 0.2s ease-out;
}
</style>
