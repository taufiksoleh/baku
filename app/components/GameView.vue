<script setup lang="ts">
import { KATEGORI_LIST } from '~/composables/words'

const { state, accuracy, progress, init, nextQuestion, answer, reset, setKategori } = useGame()
const { playCorrect, playWrong } = useSound()

const awaitingNext = ref(false)
const feedbackResult = ref<{ isCorrect: boolean, correctWord: string, incorrectWord: string, bonusPoints: number } | null>(null)
const leftBtnClass = ref('')
const rightBtnClass = ref('')
const autoAdvanceTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const selectedKategori = ref('Semua')

onMounted(() => {
  init()
})

function handleAnswer(isLeft: boolean) {
  if (awaitingNext.value) return
  if (!state.optionLeft || !state.optionRight) return

  const isBakuChosen = isLeft ? state.optionLeft.isBaku : state.optionRight.isBaku
  const result = answer(isBakuChosen)
  if (!result) return

  awaitingNext.value = true
  feedbackResult.value = result

  if (result.isCorrect) {
    playCorrect()
    if (isLeft) leftBtnClass.value = 'correct'
    else rightBtnClass.value = 'correct'
  } else {
    playWrong()
    if (isLeft) {
      leftBtnClass.value = 'wrong'
      rightBtnClass.value = 'correct'
    } else {
      rightBtnClass.value = 'wrong'
      leftBtnClass.value = 'correct'
    }
  }

  autoAdvanceTimer.value = setTimeout(() => {
    if (awaitingNext.value) {
      advance()
    }
  }, 2000)
}

function advance() {
  if (autoAdvanceTimer.value) {
    clearTimeout(autoAdvanceTimer.value)
    autoAdvanceTimer.value = null
  }
  awaitingNext.value = false
  feedbackResult.value = null
  leftBtnClass.value = ''
  rightBtnClass.value = ''
  nextQuestion()
}

function handleReset() {
  if (autoAdvanceTimer.value) {
    clearTimeout(autoAdvanceTimer.value)
    autoAdvanceTimer.value = null
  }
  awaitingNext.value = false
  feedbackResult.value = null
  leftBtnClass.value = ''
  rightBtnClass.value = ''
  reset()
}

function handleKategoriChange(value: string) {
  selectedKategori.value = value
  if (autoAdvanceTimer.value) {
    clearTimeout(autoAdvanceTimer.value)
    autoAdvanceTimer.value = null
  }
  awaitingNext.value = false
  feedbackResult.value = null
  leftBtnClass.value = ''
  rightBtnClass.value = ''
  setKategori(value)
}
</script>

<template>
  <div class="space-y-3">
    <!-- Stats Bar -->
    <div class="grid grid-cols-4 gap-2">
      <div class="stat-card">
        <span class="stat-label">Poin</span>
        <span class="stat-value text-primary">{{ state.score }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Rekor</span>
        <span class="stat-value text-primary">{{ state.highScore }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Streak</span>
        <span class="stat-value text-amber-500">{{ state.streak }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Akurasi</span>
        <span class="stat-value text-emerald-500">{{ accuracy }}%</span>
      </div>
    </div>

    <!-- Category Selector -->
    <USelect
      :model-value="selectedKategori"
      :items="KATEGORI_LIST"
      placeholder="📂 Kategori"
      size="md"
      @update:model-value="handleKategoriChange"
    />

    <!-- Game Card -->
    <UCard>
      <!-- Streak Badge -->
      <div
        v-if="state.streak >= 3"
        class="streak-badge"
      >
        🔥 {{ state.streak }}x Streak!
      </div>

      <!-- Progress Bar -->
      <div class="mb-3">
        <div class="flex justify-between text-xs text-muted mb-1">
          <span>Soal ke-{{ state.currentIndex }}</span>
          <span>Progress</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progress + '%' }" />
        </div>
      </div>

      <!-- Question Prompt -->
      <div class="text-center mb-4">
        <p class="text-sm text-muted">Manakah yang merupakan</p>
        <p class="text-base font-semibold">
          ✅ <span class="text-primary">Kata Baku</span> yang benar?
        </p>
      </div>

      <!-- Options -->
      <div class="grid grid-cols-2 gap-3 mb-3">
        <button
          class="option-btn"
          :class="leftBtnClass"
          :disabled="awaitingNext"
          @click="handleAnswer(true)"
        >
          {{ state.optionLeft?.text ?? '—' }}
        </button>
        <button
          class="option-btn"
          :class="rightBtnClass"
          :disabled="awaitingNext"
          @click="handleAnswer(false)"
        >
          {{ state.optionRight?.text ?? '—' }}
        </button>
      </div>

      <!-- Feedback -->
      <div
        v-if="feedbackResult"
        class="feedback"
        :class="feedbackResult.isCorrect ? 'feedback-correct' : 'feedback-wrong'"
      >
        <p class="font-semibold text-sm">
          {{ feedbackResult.isCorrect ? '✅ Benar!' : '❌ Salah!' }}
        </p>
        <p class="text-xs mt-1 opacity-80">
          <template v-if="feedbackResult.isCorrect && state.streak >= 3">
            +{{ feedbackResult.bonusPoints }} poin (bonus streak {{ state.streak }}x!)
          </template>
          <template v-else-if="feedbackResult.isCorrect">
            "{{ feedbackResult.correctWord }}" adalah kata baku yang benar. +10 poin
          </template>
          <template v-else>
            Kata baku yang benar adalah "{{ feedbackResult.correctWord }}" (bukan "{{ feedbackResult.incorrectWord }}"). -5 poin
          </template>
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 mt-3">
        <UButton
          v-if="awaitingNext"
          class="flex-1"
          label="Soal Berikutnya ➡️"
          @click="advance"
        />
        <UButton
          color="neutral"
          variant="soft"
          label="🔄 Reset"
          @click="handleReset"
        />
      </div>
    </UCard>

    <!-- Footer Reference -->
    <p class="text-center text-xs text-muted pb-2">
      Referensi: KBBI —
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
.stat-card {
  background: var(--ui-bg-elevated);
  border-radius: 10px;
  padding: 8px 6px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.stat-label {
  font-size: 0.6rem;
  color: var(--ui-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  display: block;
  margin-top: 1px;
  font-variant-numeric: tabular-nums;
}

.streak-badge {
  text-align: center;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  font-weight: 600;
  font-size: 0.82rem;
  padding: 6px 16px;
  border-radius: 999px;
  margin-bottom: 12px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

.progress-track {
  background: var(--ui-border);
  border-radius: 999px;
  height: 4px;
  overflow: hidden;
}

.progress-fill {
  background: var(--ui-primary);
  height: 100%;
  border-radius: 999px;
  width: 0%;
  transition: width 0.5s ease;
}

.option-btn {
  padding: 14px 10px;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  background: var(--ui-primary);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 56px;
  word-break: break-word;
  -webkit-user-select: none;
  user-select: none;
  touch-action: manipulation;
}

.option-btn:active:not(:disabled) {
  transform: scale(0.96);
  opacity: 0.75;
}

.option-btn.correct {
  background: #22c55e;
  animation: correctPop 0.3s ease;
}

.option-btn.wrong {
  background: #ef4444;
  animation: wrongShake 0.4s ease;
}

.option-btn:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

@keyframes correctPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes wrongShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.feedback {
  padding: 10px 12px;
  border-radius: 10px;
  animation: feedbackSlideIn 0.25s ease;
}

.feedback-correct {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.feedback-wrong {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
}

@keyframes feedbackSlideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
