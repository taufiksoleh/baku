<script setup lang="ts">
const title = 'Kata Baku vs Tidak Baku – Game KBBI'
const description = 'Game kuis interaktif untuk menguji pengetahuan kata baku dan tidak baku berdasarkan KBBI'

useHead({
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ]
})

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

const activeTab = ref('game')

const tabs = [
  { label: 'Bermain', value: 'game', icon: 'i-lucide-gamepad-2' },
  { label: 'Cara Main', value: 'howto', icon: 'i-lucide-help-circle' },
  { label: 'Daftar Kata', value: 'wordlist', icon: 'i-lucide-book-open' }
]

function setActiveTab(value: string) {
  activeTab.value = value
}
</script>

<template>
  <UApp>
    <div class="mobile-container">
      <!-- Sticky Header -->
      <header class="app-header">
        <h1 class="text-lg font-bold tracking-tight text-center">
          📖 Kata <span class="text-primary">Baku</span> vs Tidak Baku
        </h1>
        <p class="text-xs text-center text-muted mt-0.5">
          Uji pengetahuanmu tentang KBBI
        </p>
      </header>

      <!-- Main Content Area -->
      <main class="app-content">
        <GameView v-show="activeTab === 'game'" />
        <HowToPlay v-show="activeTab === 'howto'" />
        <WordList v-show="activeTab === 'wordlist'" />
      </main>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="nav-item"
          :class="{ active: activeTab === tab.value }"
          @click="setActiveTab(tab.value)"
        >
          <UIcon :name="tab.icon" class="nav-icon" />
          <span class="nav-label">{{ tab.label }}</span>
        </button>
      </nav>
    </div>
  </UApp>
</template>

<style>
/* Mobile-only app container */
.mobile-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: var(--ui-bg);
  position: relative;
}

@media (min-width: 481px) {
  body {
    background-color: #1a1a2e;
  }
  .mobile-container {
    border-left: 1px solid var(--ui-border);
    border-right: 1px solid var(--ui-border);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.15);
  }
}

/* Sticky Header */
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: var(--ui-bg-elevated);
  backdrop-filter: saturate(180%) blur(20px);
  padding: calc(env(safe-area-inset-top, 0px) + 12px) 16px 10px;
  border-bottom: 1px solid var(--ui-border);
}

/* Main scrollable content */
.app-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
  padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px));
}

/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: var(--ui-bg-elevated);
  border-top: 1px solid var(--ui-border);
  padding: 6px 0 calc(6px + env(safe-area-inset-bottom, 0px));
  z-index: 30;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: var(--ui-text-muted);
}

.nav-item.active {
  color: var(--ui-primary);
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-icon {
  width: 22px;
  height: 22px;
}

.nav-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.2px;
}
</style>
