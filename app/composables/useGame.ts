import { KATA_DATA, getKataByKategori, shuffleArray } from './words'
import type { KataItem } from './words'

interface GameOption {
  text: string
  isBaku: boolean
}

interface AnswerResult {
  isCorrect: boolean
  correctWord: string
  incorrectWord: string
  score: number
  streak: number
  bonusPoints: number
}

interface GameState {
  score: number
  highScore: number
  totalAnswered: number
  correctAnswers: number
  currentQuestion: KataItem | null
  currentIndex: number
  questions: KataItem[]
  selectedKategori: string
  streak: number
  bestStreak: number
  optionLeft: GameOption | null
  optionRight: GameOption | null
}

export function useGame() {
  const state = reactive<GameState>({
    score: 0,
    highScore: 0,
    totalAnswered: 0,
    correctAnswers: 0,
    currentQuestion: null,
    currentIndex: 0,
    questions: [],
    selectedKategori: 'Semua',
    streak: 0,
    bestStreak: 0,
    optionLeft: null,
    optionRight: null
  })

  const accuracy = computed(() => {
    if (state.totalAnswered === 0) return 0
    return Math.round((state.correctAnswers / state.totalAnswered) * 100)
  })

  const progress = computed(() => {
    if (state.questions.length === 0) return 0
    return Math.min(100, (state.currentIndex / state.questions.length) * 100)
  })

  function loadHighScore() {
    if (import.meta.client) {
      const saved = localStorage.getItem('kataBakuHighScore')
      if (saved) state.highScore = parseInt(saved, 10)
      const savedBestStreak = localStorage.getItem('kataBakuBestStreak')
      if (savedBestStreak) state.bestStreak = parseInt(savedBestStreak, 10)
    }
  }

  function saveHighScore() {
    if (import.meta.client) {
      if (state.score > state.highScore) {
        state.highScore = state.score
        localStorage.setItem('kataBakuHighScore', String(state.highScore))
      }
      if (state.streak > state.bestStreak) {
        state.bestStreak = state.streak
        localStorage.setItem('kataBakuBestStreak', String(state.bestStreak))
      }
    }
  }

  function prepareQuestions() {
    const kata = getKataByKategori(state.selectedKategori)
    state.questions = shuffleArray(kata)
    state.currentIndex = 0
  }

  function nextQuestion() {
    if (state.currentIndex >= state.questions.length) {
      prepareQuestions()
    }
    state.currentQuestion = state.questions[state.currentIndex]
    state.currentIndex++

    if (Math.random() < 0.5) {
      state.optionLeft = { text: state.currentQuestion.baku, isBaku: true }
      state.optionRight = { text: state.currentQuestion.tidakBaku, isBaku: false }
    } else {
      state.optionLeft = { text: state.currentQuestion.tidakBaku, isBaku: false }
      state.optionRight = { text: state.currentQuestion.baku, isBaku: true }
    }
  }

  function answer(isBakuChosen: boolean): AnswerResult | null {
    if (!state.currentQuestion) return null

    const isCorrect = isBakuChosen
    state.totalAnswered++
    let bonusPoints = 10

    if (isCorrect) {
      state.correctAnswers++
      state.streak++
      const bonus = state.streak >= 5 ? 3 : state.streak >= 3 ? 2 : 1
      bonusPoints = 10 * bonus
      state.score += bonusPoints
      saveHighScore()
    } else {
      state.streak = 0
      bonusPoints = -5
      state.score = Math.max(0, state.score - 5)
    }

    return {
      isCorrect,
      correctWord: state.currentQuestion.baku,
      incorrectWord: state.currentQuestion.tidakBaku,
      score: state.score,
      streak: state.streak,
      bonusPoints
    }
  }

  function reset() {
    state.score = 0
    state.totalAnswered = 0
    state.correctAnswers = 0
    state.streak = 0
    prepareQuestions()
    nextQuestion()
  }

  function setKategori(kategori: string) {
    state.selectedKategori = kategori
    reset()
  }

  function init() {
    loadHighScore()
    prepareQuestions()
    nextQuestion()
  }

  return {
    state: readonly(state),
    accuracy,
    progress,
    init,
    nextQuestion,
    answer,
    reset,
    setKategori
  }
}
