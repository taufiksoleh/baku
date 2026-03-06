<template>
  <div class="space-y-4">
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-gamepad-2" class="text-primary w-5 h-5" />
          <h2 class="font-bold text-base">Cara Bermain</h2>
        </div>
      </template>

      <div class="space-y-3 text-sm">
        <div class="flex gap-3 items-start">
          <div class="step-number">1</div>
          <p>Dua pilihan kata akan ditampilkan di layar</p>
        </div>
        <div class="flex gap-3 items-start">
          <div class="step-number">2</div>
          <p>Pilih mana yang merupakan <strong class="text-primary">kata baku</strong> yang benar menurut KBBI</p>
        </div>
        <div class="flex gap-3 items-start">
          <div class="step-number">3</div>
          <p>Kumpulkan poin dari setiap jawaban benar</p>
        </div>
        <div class="flex gap-3 items-start">
          <div class="step-number">4</div>
          <p>Streak jawaban benar berturut-turut memberikan <strong class="text-amber-500">bonus poin!</strong></p>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-trophy" class="text-amber-500 w-5 h-5" />
          <h2 class="font-bold text-base">Sistem Poin</h2>
        </div>
      </template>

      <div class="space-y-2">
        <div class="score-row">
          <span class="flex items-center gap-2">
            <span class="text-emerald-500">✅</span> Jawaban benar
          </span>
          <UBadge color="success" variant="subtle">+10 poin</UBadge>
        </div>
        <div class="score-row">
          <span class="flex items-center gap-2">
            <span class="text-amber-500">🔥</span> Streak 3x
          </span>
          <UBadge color="warning" variant="subtle">+20 poin</UBadge>
        </div>
        <div class="score-row">
          <span class="flex items-center gap-2">
            <span class="text-orange-500">💥</span> Streak 5x
          </span>
          <UBadge color="warning" variant="subtle">+30 poin</UBadge>
        </div>
        <div class="score-row">
          <span class="flex items-center gap-2">
            <span class="text-red-500">❌</span> Jawaban salah
          </span>
          <UBadge color="error" variant="subtle">-5 poin</UBadge>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-folder" class="text-primary w-5 h-5" />
          <h2 class="font-bold text-base">Kategori Kata</h2>
        </div>
      </template>

      <div class="space-y-2 text-sm">
        <div class="kategori-item">
          <span class="font-semibold">📋 Umum</span>
          <span class="text-muted">Kata-kata umum sehari-hari</span>
        </div>
        <div class="kategori-item">
          <span class="font-semibold">💻 Teknologi</span>
          <span class="text-muted">Istilah teknologi & digital</span>
        </div>
        <div class="kategori-item">
          <span class="font-semibold">🎓 Pendidikan</span>
          <span class="text-muted">Istilah akademis & ilmiah</span>
        </div>
        <div class="kategori-item">
          <span class="font-semibold">🏥 Kesehatan</span>
          <span class="text-muted">Istilah medis & kesehatan</span>
        </div>
        <div class="kategori-item">
          <span class="font-semibold">🏛️ Pemerintahan</span>
          <span class="text-muted">Istilah pemerintahan & hukum</span>
        </div>
        <div class="kategori-item">
          <span class="font-semibold">🗣️ Sehari-hari</span>
          <span class="text-muted">Kata-kata percakapan harian</span>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-info" class="text-primary w-5 h-5" />
          <h2 class="font-bold text-base">Tentang</h2>
        </div>
      </template>

      <p class="text-sm text-muted leading-relaxed">
        Game ini mengacu pada <strong>KBBI (Kamus Besar Bahasa Indonesia)</strong>
        sebagai sumber referensi kata baku. Kata baku adalah kata yang sesuai dengan
        kaidah bahasa Indonesia yang baik dan benar.
      </p>
      <div class="mt-3">
        <UButton
          to="https://kbbi.kemendikdasmen.go.id"
          target="_blank"
          variant="soft"
          icon="i-lucide-external-link"
          label="Buka KBBI Online"
          size="sm"
        />
      </div>
    </UCard>
  </div>
</template>

<style scoped>
.step-number {
  min-width: 24px;
  height: 24px;
  background: var(--ui-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
}

.score-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 0.85rem;
}

.kategori-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 0;
  border-bottom: 1px solid var(--ui-border);
}

.kategori-item:last-child {
  border-bottom: none;
}
</style>
