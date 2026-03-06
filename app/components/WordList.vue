<script setup lang="ts">
import { KATA_DATA, KATEGORI_LIST, getKataByKategori } from '~/composables/words'

const selectedKategori = ref('Semua')
const searchQuery = ref('')

const filteredWords = computed(() => {
  let words = getKataByKategori(selectedKategori.value)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    words = words.filter(
      w => w.baku.toLowerCase().includes(q) || w.tidakBaku.toLowerCase().includes(q)
    )
  }
  return words
})
</script>

<template>
  <div class="space-y-3">
    <!-- Search -->
    <UInput
      v-model="searchQuery"
      placeholder="Cari kata..."
      icon="i-lucide-search"
      size="md"
    />

    <!-- Filter -->
    <div class="flex items-center gap-2">
      <USelect
        v-model="selectedKategori"
        :items="KATEGORI_LIST"
        size="sm"
        class="flex-1"
      />
      <UBadge color="primary" variant="subtle" size="sm">
        {{ filteredWords.length }} kata
      </UBadge>
    </div>

    <!-- Word Cards -->
    <div class="space-y-2">
      <div
        v-for="(item, index) in filteredWords"
        :key="item.baku"
        class="word-card"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="word-number">{{ index + 1 }}</span>
            <div>
              <p class="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                ✅ {{ item.baku }}
              </p>
              <p class="text-xs text-red-400 line-through">
                ❌ {{ item.tidakBaku }}
              </p>
            </div>
          </div>
          <UBadge color="primary" variant="subtle" size="xs">
            {{ item.kategori }}
          </UBadge>
        </div>
      </div>

      <div v-if="filteredWords.length === 0" class="text-center py-8 text-muted text-sm">
        Tidak ada kata ditemukan
      </div>
    </div>

    <!-- Reference -->
    <p class="text-center text-xs text-muted pt-2 pb-2">
      Sumber: KBBI —
      <a
        href="https://kbbi.kemendikdasmen.go.id"
        target="_blank"
        rel="noopener"
        class="text-primary hover:underline"
      >kbbi.kemendikdasmen.go.id</a>
    </p>
  </div>
</template>

<style scoped>
.word-card {
  background: var(--ui-bg-elevated);
  border-radius: 10px;
  padding: 10px 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--ui-border);
}

.word-number {
  min-width: 24px;
  height: 24px;
  background: var(--ui-border);
  color: var(--ui-text-muted);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  flex-shrink: 0;
}
</style>
