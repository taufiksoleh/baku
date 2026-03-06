// Game logic for Kata Baku vs Tidak Baku game

const Game = (function () {
  const QUESTIONS_PER_LEVEL = 100;

  // State
  let state = {
    score: 0,
    highScore: 0,
    totalAnswered: 0,
    correctAnswers: 0,
    currentQuestion: null,
    currentIndex: 0,
    questions: [],
    selectedKategori: "Semua",
    gameOver: false,
    streak: 0,
    bestStreak: 0,
    optionLeft: null,
    optionRight: null,
    level: 1,
    levelAnswered: 0,
  };

  // Answer history
  let history = [];

  // Load high score from localStorage
  function loadHighScore() {
    const saved = localStorage.getItem("kataBakuHighScore");
    if (saved) state.highScore = parseInt(saved, 10);
    const savedBestStreak = localStorage.getItem("kataBakuBestStreak");
    if (savedBestStreak) state.bestStreak = parseInt(savedBestStreak, 10);
  }

  // Save high score to localStorage
  function saveHighScore() {
    if (state.score > state.highScore) {
      state.highScore = state.score;
      localStorage.setItem("kataBakuHighScore", state.highScore);
    }
    if (state.streak > state.bestStreak) {
      state.bestStreak = state.streak;
      localStorage.setItem("kataBakuBestStreak", state.bestStreak);
    }
  }

  // Load level data from localStorage
  function loadLevel() {
    const savedLevel = localStorage.getItem("kataBakuLevel");
    if (savedLevel) state.level = parseInt(savedLevel, 10);
    const savedLevelAnswered = localStorage.getItem("kataBakuLevelAnswered");
    if (savedLevelAnswered) state.levelAnswered = parseInt(savedLevelAnswered, 10);
  }

  // Save level data to localStorage
  function saveLevel() {
    localStorage.setItem("kataBakuLevel", state.level);
    localStorage.setItem("kataBakuLevelAnswered", state.levelAnswered);
  }

  // Load answer history from localStorage
  function loadHistory() {
    const saved = localStorage.getItem("kataBakuHistory");
    if (saved) {
      try {
        history = JSON.parse(saved);
      } catch (e) {
        history = [];
      }
    }
  }

  // Save answer history to localStorage
  function saveHistory() {
    localStorage.setItem("kataBakuHistory", JSON.stringify(history));
  }

  // Prepare questions for current kategori
  function prepareQuestions() {
    const kata = getKataByKategori(state.selectedKategori);
    state.questions = shuffleArray(kata);
    state.currentIndex = 0;
  }

  // Get next question
  function nextQuestion() {
    if (state.currentIndex >= state.questions.length) {
      state.roundComplete = true;
      prepareQuestions(); // Reshuffle when all questions answered
    } else {
      state.roundComplete = false;
    }
    state.currentQuestion = state.questions[state.currentIndex];
    state.currentIndex++;

    // Randomize which side shows baku/tidak baku
    if (Math.random() < 0.5) {
      state.optionLeft = { text: state.currentQuestion.baku, isBaku: true };
      state.optionRight = { text: state.currentQuestion.tidakBaku, isBaku: false };
    } else {
      state.optionLeft = { text: state.currentQuestion.tidakBaku, isBaku: false };
      state.optionRight = { text: state.currentQuestion.baku, isBaku: true };
    }
  }

  // Process answer
  function answer(isBakuChosen) {
    if (state.gameOver) return null;

    const isCorrect = isBakuChosen;
    state.totalAnswered++;
    state.levelAnswered++;

    // Record in history
    history.push({
      baku: state.currentQuestion.baku,
      tidakBaku: state.currentQuestion.tidakBaku,
      kategori: state.currentQuestion.kategori,
      isCorrect: isCorrect,
      level: state.level,
      timestamp: Date.now(),
    });
    saveHistory();

    // Check level up
    let leveledUp = false;
    if (state.levelAnswered >= QUESTIONS_PER_LEVEL) {
      state.level++;
      state.levelAnswered = 0;
      leveledUp = true;
    }
    saveLevel();

    if (isCorrect) {
      state.correctAnswers++;
      state.streak++;
      // Bonus points for streaks
      const bonus = state.streak >= 5 ? 3 : state.streak >= 3 ? 2 : 1;
      state.score += 10 * bonus;
      saveHighScore();
    } else {
      state.streak = 0;
      // Lose a point for wrong answer (but not below 0)
      state.score = Math.max(0, state.score - 5);
    }

    return {
      isCorrect,
      correctWord: state.currentQuestion.baku,
      incorrectWord: state.currentQuestion.tidakBaku,
      score: state.score,
      streak: state.streak,
      leveledUp: leveledUp,
      level: state.level,
    };
  }

  // Reset game
  function reset() {
    state.score = 0;
    state.totalAnswered = 0;
    state.correctAnswers = 0;
    state.streak = 0;
    state.gameOver = false;
    prepareQuestions();
    nextQuestion();
  }

  // Change kategori
  function setKategori(kategori) {
    state.selectedKategori = kategori;
    reset();
  }

  // Get accuracy percentage
  function getAccuracy() {
    if (state.totalAnswered === 0) return 0;
    return Math.round((state.correctAnswers / state.totalAnswered) * 100);
  }

  // Get answer history
  function getHistory() {
    return history.slice().reverse();
  }

  // Clear answer history
  function clearHistory() {
    history = [];
    saveHistory();
  }

  // Get level progress (0-100)
  function getLevelProgress() {
    return Math.round((state.levelAnswered / QUESTIONS_PER_LEVEL) * 100);
  }

  // Init
  function init() {
    loadHighScore();
    loadLevel();
    loadHistory();
    prepareQuestions();
    nextQuestion();
  }

  return {
    init,
    nextQuestion,
    answer,
    reset,
    setKategori,
    getAccuracy,
    getHistory,
    clearHistory,
    getLevelProgress,
    getState: () => ({ ...state }),
    QUESTIONS_PER_LEVEL,
  };
})();
