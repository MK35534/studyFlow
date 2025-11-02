<template>
  <div class="pronote-sync-container">
    <!-- Header -->
    <div class="header-section">
      <div class="flex items-center gap-3">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Synchronisation Pronote
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Importez automatiquement vos devoirs depuis Pronote
          </p>
        </div>
      </div>

      <!-- Status Badge -->
      <div v-if="isConfigured" class="status-badge" :class="statusClass">
        <span class="status-dot"></span>
        <span>{{ statusText }}</span>
      </div>
    </div>

    <!-- Configuration Form -->
    <div v-if="!isConfigured || showConfigForm" class="config-form">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Configuration
      </h3>

      <!-- URL Pronote -->
      <div class="form-group">
        <label class="form-label">
          URL de votre Pronote
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.instanceUrl"
          type="url"
          placeholder="https://0830050d.index-education.net/pronote/"
          class="form-input"
          :disabled="loading"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          💡 Exemple : https://0691234x.index-education.net/pronote/
        </p>
      </div>

      <!-- Identifiant ENT -->
      <div class="form-group">
        <label class="form-label">
          Identifiant ENT / Pronote
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.username"
          type="text"
          placeholder="prenom.nom"
          class="form-input"
          :disabled="loading"
          autocomplete="username"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          🔐 Votre identifiant ENT (Atrium, etc.) ou Pronote direct
        </p>
      </div>

      <!-- Mot de passe -->
      <div class="form-group">
        <label class="form-label">
          Mot de passe
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.password"
          type="password"
            placeholder="••••••••"
          class="form-input"
          :disabled="loading"
          autocomplete="current-password"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          🔒 Votre mot de passe est chiffré (AES-256) et n'est jamais stocké en clair
        </p>
      </div>

      <!-- Info : Config dans Paramètres -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
        <p class="text-sm text-blue-800 dark:text-blue-300">
          💡 Les options de synchronisation (devoirs, emploi du temps, fréquence) se configurent dans 
          <NuxtLink to="/dashboard/pronote-settings" class="font-semibold underline hover:text-blue-600">
            Paramètres Pronote
          </NuxtLink>
        </p>
      </div>

      <!-- Save Button -->
      <button
        @click="saveConfig"
        :disabled="loading || !canSave"
        class="save-btn"
      >
        <span v-if="loading">Enregistrement...</span>
        <span v-else>Enregistrer et synchroniser</span>
      </button>
    </div>

    <!-- Dashboard (when configured) -->
    <div v-if="isConfigured && !showConfigForm" class="dashboard">
      <!-- Last Sync Info -->
      <div class="sync-info-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Dernière synchronisation</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {{ lastSyncFormatted }}
            </p>
          </div>
          <button
            @click="syncNow"
            :disabled="loading"
            class="sync-btn"
          >
            <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span v-if="loading">Synchronisation...</span>
            <span v-else>Synchroniser maintenant</span>
          </button>
        </div>
      </div>

      <!-- Statistics -->
      <div v-if="syncStats" class="stats-grid">
        <div class="stat-card">
          <p class="stat-label">Total importé</p>
          <p class="stat-value">{{ syncStats.total_imported || 0 }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">Dernière synchro</p>
          <p class="stat-value">{{ lastSyncResult?.imported || 0 }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">Matières créées</p>
          <p class="stat-value">{{ syncStats.total_subjects_created || 0 }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">Synchronisations</p>
          <p class="stat-value">{{ syncStats.total_syncs || 0 }}</p>
        </div>
      </div>

      <!-- Sync History -->
      <div v-if="syncLogs.length > 0" class="sync-history">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Historique des synchronisations
        </h3>
        <div class="space-y-2">
          <div
            v-for="log in syncLogs.slice(0, 5)"
            :key="log.id"
            class="log-item"
            :class="getLogClass(log.status)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="log-icon" :class="getLogIconClass(log.status)">
                  <svg v-if="log.status === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <svg v-else-if="log.status === 'error'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatLogDate(log.sync_started_at) }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ getLogSummary(log) }}
                  </p>
                </div>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ log.duration_seconds }}s
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-footer">
        <button @click="showConfigForm = true" class="action-btn secondary">
          Modifier la configuration
        </button>
        <button @click="deleteConfig" class="action-btn danger">
          Supprimer la configuration
        </button>
      </div>
    </div>

    <!-- Toast Notifications -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <p class="toast-message">{{ toast.message }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { getToken } = useAuth()

// State
const loading = ref(false);
const isConfigured = ref(false);
const showConfigForm = ref(false);
const config = ref(null);
const syncLogs = ref([]);
const syncStats = ref(null);
const lastSyncResult = ref(null);

const formData = ref({
  instanceUrl: '',
  username: '',
  password: '',
  autoSync: false
});

const toast = ref({
  show: false,
  message: '',
  type: 'success'
});

// Computed
const canSave = computed(() => {
  return formData.value.instanceUrl && 
         formData.value.username && 
         formData.value.password;
});

const statusClass = computed(() => {
  if (!config.value?.lastSync) return 'status-idle';
  const lastSync = new Date(config.value.lastSync);
  const hoursSince = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);
  
  if (hoursSince < 24) return 'status-success';
  if (hoursSince < 72) return 'status-warning';
  return 'status-error';
});

const statusText = computed(() => {
  if (!config.value?.lastSync) return 'Jamais synchronisé';
  const lastSync = new Date(config.value.lastSync);
  const hoursSince = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);
  
  if (hoursSince < 1) return 'Synchronisé récemment';
  if (hoursSince < 24) return 'À jour';
  if (hoursSince < 72) return 'Synchronisation recommandée';
  return 'Synchronisation nécessaire';
});

const lastSyncFormatted = computed(() => {
  if (!config.value?.lastSync) return 'Jamais';
  return formatRelativeTime(new Date(config.value.lastSync));
});

// Methods
async function checkInstance() {
  loading.value = true;
  try {
    const response = await $fetch('/api/pronote/check-instance', {
      method: 'POST',
      body: { url: formData.value.instanceUrl },
      credentials: 'include'
    });

    if (response.success) {
      instanceInfo.value = response.data;
      instanceChecked.value = true;
      showToast('Instance Pronote trouvée !', 'success');
    } else {
      showToast(response.error, 'error');
    }
  } catch (error) {
    showToast('Erreur lors de la vérification', 'error');
  } finally {
    loading.value = false;
  }
}

async function saveConfig() {
  loading.value = true;
  try {
    const token = getToken()
    const response = await $fetch('/api/pronote/save-config', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData.value
    });

    if (response.success) {
      showToast('Configuration enregistrée !', 'success');
      showConfigForm.value = false;
      await loadConfig();
      await syncNow();
    } else {
      showToast(response.error, 'error');
    }
  } catch (error) {
    showToast('Erreur lors de l\'enregistrement', 'error');
  } finally {
    loading.value = false;
  }
}

async function syncNow() {
  loading.value = true;
  try {
    const token = getToken()
    const response = await $fetch('/api/pronote/sync', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.success) {
      lastSyncResult.value = response.stats;
      showToast(
        `✅ ${response.stats.imported} devoirs importés, ${response.stats.skipped} ignorés`,
        'success'
      );
      await loadConfig();
      await loadSyncLogs();
    } else {
      showToast(response.error, 'error');
    }
  } catch (error) {
    showToast('Erreur lors de la synchronisation', 'error');
  } finally {
    loading.value = false;
  }
}

async function loadConfig() {
  try {
    const token = getToken()
    const response = await $fetch('/api/pronote/config', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('[PronoteSync] Config loaded:', response)
    if (response.success && response.configured) {
      config.value = response.data;
      isConfigured.value = true;
      console.log('[PronoteSync] Config is configured:', config.value)
    } else {
      console.log('[PronoteSync] No config found, showing form')
      isConfigured.value = false
    }
  } catch (error) {
    console.error('Error loading config:', error);
    isConfigured.value = false
  }
}

async function loadSyncLogs() {
  try {
    const token = getToken()
    console.log('[PronoteSync] Loading sync logs with token:', token ? 'present' : 'missing')
    const response = await $fetch('/api/pronote/sync-logs?limit=10', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('[PronoteSync] Sync logs response:', response)
    if (response.success) {
      syncLogs.value = response.logs || [];
      syncStats.value = response.stats || null;
      console.log('[PronoteSync] Loaded', syncLogs.value.length, 'logs')
      console.log('[PronoteSync] Stats:', syncStats.value)
    } else {
      console.warn('[PronoteSync] Failed to load sync logs:', response.error)
    }
  } catch (error) {
    console.error('Error loading sync logs:', error);
    syncLogs.value = []
    syncStats.value = null
  }
}

async function deleteConfig() {
  if (!confirm('Êtes-vous sûr de vouloir supprimer la configuration Pronote ?')) {
    return;
  }

  loading.value = true;
  try {
    const token = getToken()
    const response = await $fetch('/api/pronote/config', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.success) {
      showToast('Configuration supprimée', 'success');
      isConfigured.value = false;
      config.value = null;
      showConfigForm.value = false;
    }
  } catch (error) {
    showToast('Erreur lors de la suppression', 'error');
  } finally {
    loading.value = false;
  }
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
}

function formatRelativeTime(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'À l\'instant';
  if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
  return `Il y a ${Math.floor(seconds / 86400)} jours`;
}

function formatLogDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getLogSummary(log) {
  if (log.status === 'error') return log.error_message || 'Échec';
  if (log.status === 'in_progress') return 'En cours...';
  
  const parts = [];
  if (log.assignments_imported > 0) parts.push(`${log.assignments_imported} importés`);
  if (log.assignments_skipped > 0) parts.push(`${log.assignments_skipped} ignorés`);
  if (log.subjects_created > 0) parts.push(`${log.subjects_created} matières créées`);
  
  return parts.length > 0 ? parts.join(', ') : 'Aucun changement';
}

function getLogClass(status) {
  return `log-${status}`;
}

function getLogIconClass(status) {
  return `icon-${status}`;
}

// Lifecycle
onMounted(() => {
  loadConfig();
  loadSyncLogs();
});
</script>

<style scoped>
.pronote-sync-container {
  @apply max-w-4xl mx-auto p-6 space-y-6;
}

.header-section {
  @apply flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700;
}

.icon-wrapper {
  @apply w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white;
}

.status-badge {
  @apply px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2;
}

.status-dot {
  @apply w-2 h-2 rounded-full;
}

.status-idle {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300;
}

.status-idle .status-dot {
  @apply bg-gray-400;
}

.status-success {
  @apply bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400;
}

.status-success .status-dot {
  @apply bg-green-500 animate-pulse;
}

.status-warning {
  @apply bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400;
}

.status-warning .status-dot {
  @apply bg-orange-500;
}

.status-error {
  @apply bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400;
}

.status-error .status-dot {
  @apply bg-red-500;
}

.config-form,
.dashboard {
  @apply p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-4;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-input {
  @apply w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all;
}

.input-with-button {
  @apply flex gap-2;
}

.check-btn,
.save-btn,
.sync-btn,
.ent-btn {
  @apply px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed;
}

.check-btn {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 whitespace-nowrap;
}

.save-btn,
.ent-btn {
  @apply w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl;
}

.sync-btn {
  @apply bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-md hover:shadow-lg;
}

.checkbox {
  @apply w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-0;
}

.instance-info {
  @apply p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl;
}

.ent-notice {
  @apply p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl;
}

.sync-info-card {
  @apply p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800;
}

.stats-grid {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}

.stat-card {
  @apply p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 text-center;
}

.stat-label {
  @apply text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide;
}

.stat-value {
  @apply text-2xl font-bold text-gray-900 dark:text-white mt-2;
}

.sync-history {
  @apply space-y-3;
}

.log-item {
  @apply p-4 rounded-xl border transition-all;
}

.log-success {
  @apply bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800;
}

.log-error {
  @apply bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800;
}

.log-in_progress {
  @apply bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800;
}

.log-icon {
  @apply w-8 h-8 rounded-full flex items-center justify-center;
}

.icon-success {
  @apply bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400;
}

.icon-error {
  @apply bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400;
}

.icon-in_progress {
  @apply bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400;
}

.actions-footer {
  @apply flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700;
}

.action-btn {
  @apply flex-1 px-4 py-3 rounded-xl font-medium transition-all;
}

.action-btn.secondary {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600;
}

.action-btn.danger {
  @apply bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50;
}

.toast {
  @apply fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl text-white font-medium z-50;
}

.toast.success {
  @apply bg-green-500;
}

.toast.error {
  @apply bg-red-500;
}

.toast.warning {
  @apply bg-orange-500;
}

.toast-enter-active,
.toast-leave-active {
  @apply transition-all duration-300;
}

.toast-enter-from,
.toast-leave-to {
  @apply opacity-0 transform translate-y-4;
}
</style>
