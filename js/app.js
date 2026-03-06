// Main app initialization and UI rendering

document.addEventListener("DOMContentLoaded", function () {
  // =====================
  // DOM Element References
  // =====================
  const scoreDisplay = document.getElementById("score");
  const highScoreDisplay = document.getElementById("high-score");
  const streakDisplay = document.getElementById("streak");
  const accuracyDisplay = document.getElementById("accuracy");
  const questionCounter = document.getElementById("question-counter");
  const optionLeftBtn = document.getElementById("option-left");
  const optionRightBtn = document.getElementById("option-right");
  const feedbackEl = document.getElementById("feedback");
  const feedbackText = document.getElementById("feedback-text");
  const feedbackDetail = document.getElementById("feedback-detail");
  const nextBtn = document.getElementById("next-btn");
  const resetBtn = document.getElementById("reset-btn");
  const kategoriSelect = document.getElementById("kategori-select");
  const streakBadge = document.getElementById("streak-badge");
  const wordListKategori = document.getElementById("word-list-kategori");
  const progressBar = document.getElementById("progress-bar");
  const bottomNav = document.getElementById("bottom-nav");

  // Level elements
  const levelNumber = document.getElementById("level-number");
  const levelProgressBar = document.getElementById("level-progress-bar");
  const levelProgressText = document.getElementById("level-progress-text");

  // History elements
  const historyList = document.getElementById("history-list");
  const historyEmpty = document.getElementById("history-empty");
  const historyCount = document.getElementById("history-count");
  const historyFilterSelect = document.getElementById("history-filter-select");
  const historyCorrectCount = document.getElementById("history-correct-count");
  const historyWrongCount = document.getElementById("history-wrong-count");
  const historyTotalCount = document.getElementById("history-total-count");
  const clearHistoryBtn = document.getElementById("clear-history-btn");

  let awaitingNext = false;

  // =====================
  // Bottom Navigation — Tab Switching
  // =====================
  const navItems = bottomNav.querySelectorAll(".bottom-nav-item");
  const tabViews = document.querySelectorAll(".tab-view");

  navItems.forEach(function (item) {
    item.addEventListener("click", function () {
      const targetTab = item.getAttribute("data-tab");

      // Update active nav item
      navItems.forEach(function (nav) { nav.classList.remove("active"); });
      item.classList.add("active");

      // Show target tab, hide others
      tabViews.forEach(function (view) {
        if (view.id === targetTab) {
          view.classList.add("tab-active");
        } else {
          view.classList.remove("tab-active");
        }
      });

      // Render history when switching to history tab
      if (targetTab === "tab-riwayat") {
        renderHistory();
      }
    });
  });

  // =====================
  // Populate Kategori Select
  // =====================
  KATEGORI_LIST.forEach((kategori) => {
    const option = document.createElement("option");
    option.value = kategori;
    option.textContent = kategori;
    kategoriSelect.appendChild(option);
  });

  // =====================
  // Initialize Game
  // =====================
  Game.init();
  renderQuestion();
  renderWordList("Semua");
  updateLevelDisplay();

  // =====================
  // Update Level Display
  // =====================
  function updateLevelDisplay() {
    const state = Game.getState();
    levelNumber.textContent = state.level;
    const progress = Game.getLevelProgress();
    levelProgressBar.style.width = progress + "%";
    levelProgressText.textContent = `${state.levelAnswered} / ${Game.QUESTIONS_PER_LEVEL}`;
  }

  // =====================
  // Show Level Up Toast
  // =====================
  function showLevelUpToast(level) {
    const toast = document.createElement("div");
    toast.className = "level-up-toast";
    toast.innerHTML = `Level Up! 🎉<span class="level-up-number">Level ${level}</span>`;
    document.body.appendChild(toast);
    Confetti.partyFinish();
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.5s ease";
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  }

  // =====================
  // Render Question
  // =====================
  function renderQuestion() {
    const state = Game.getState();
    awaitingNext = false;

    // Update stats
    scoreDisplay.textContent = state.score;
    highScoreDisplay.textContent = state.highScore;
    streakDisplay.textContent = state.streak;
    accuracyDisplay.textContent = Game.getAccuracy() + "%";
    questionCounter.textContent = `Soal ke-${state.currentIndex}`;

    // Update progress bar
    const progress = (state.currentIndex / state.questions.length) * 100;
    progressBar.style.width = Math.min(100, progress) + "%";

    // Update streak badge
    if (state.streak >= 3) {
      streakBadge.classList.remove("hidden");
      streakBadge.textContent = `${state.streak}x Streak!`;
    } else {
      streakBadge.classList.add("hidden");
    }

    // Set options
    optionLeftBtn.textContent = state.optionLeft.text;
    optionRightBtn.textContent = state.optionRight.text;

    // Reset button styles
    optionLeftBtn.className = "option-btn";
    optionRightBtn.className = "option-btn";
    optionLeftBtn.disabled = false;
    optionRightBtn.disabled = false;

    // Hide feedback
    feedbackEl.classList.add("hidden");
    feedbackEl.className = "feedback hidden";
    nextBtn.classList.add("hidden");

    // Update level display
    updateLevelDisplay();
  }

  // =====================
  // Handle Answer
  // =====================
  function handleAnswer(chosenBtn, isLeftChosen) {
    if (awaitingNext) return;

    const state = Game.getState();
    const isBakuChosen = isLeftChosen ? state.optionLeft.isBaku : state.optionRight.isBaku;

    const result = Game.answer(isBakuChosen);
    awaitingNext = true;

    // Update score display immediately
    scoreDisplay.textContent = result.score;
    highScoreDisplay.textContent = Game.getState().highScore;

    // Disable both buttons
    optionLeftBtn.disabled = true;
    optionRightBtn.disabled = true;

    if (result.isCorrect) {
      // Play correct sound
      Sound.playCorrect();

      // Correct answer
      chosenBtn.classList.add("correct");
      feedbackEl.className = "feedback correct";
      feedbackText.textContent = "Benar!";

      const newState = Game.getState();
      if (newState.streak >= 3) {
        const bonus = newState.streak >= 5 ? 3 : 2;
        feedbackDetail.textContent = `+${10 * bonus} poin (bonus streak ${newState.streak}x!)`;
      } else {
        feedbackDetail.textContent = `"${result.correctWord}" adalah kata baku yang benar. +10 poin`;
      }

      // Always update streak display
      streakDisplay.textContent = newState.streak;
      accuracyDisplay.textContent = Game.getAccuracy() + "%";

      // Show streak badge for 3+
      if (newState.streak >= 3) {
        streakBadge.classList.remove("hidden");
        streakBadge.textContent = `${newState.streak}x Streak!`;
      }

      // Party animation on streak milestones (3, 5, 10, 15, 20, ...)
      if (newState.streak === 3 || newState.streak === 5 || (newState.streak >= 10 && newState.streak % 5 === 0)) {
        Confetti.partyStreak();
      }
    } else {
      // Play wrong sound
      Sound.playWrong();

      // Wrong answer
      chosenBtn.classList.add("wrong");

      // Highlight the correct answer
      const correctBtn = isLeftChosen ? optionRightBtn : optionLeftBtn;
      correctBtn.classList.add("correct");

      feedbackEl.className = "feedback wrong";
      feedbackText.textContent = "Salah!";
      feedbackDetail.textContent = `Kata baku yang benar adalah "${result.correctWord}" (bukan "${result.incorrectWord}"). -5 poin`;

      streakBadge.classList.add("hidden");
      streakDisplay.textContent = "0";
      accuracyDisplay.textContent = Game.getAccuracy() + "%";
      scoreDisplay.textContent = result.score;
    }

    feedbackEl.classList.remove("hidden");
    nextBtn.classList.remove("hidden");

    // Update level display after answer
    updateLevelDisplay();

    // Show level up toast
    if (result.leveledUp) {
      showLevelUpToast(result.level);
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (awaitingNext) {
        advanceQuestion();
      }
    }, 2000);
  }

  // =====================
  // Advance to Next Question
  // =====================
  function advanceQuestion() {
    Game.nextQuestion();
    const state = Game.getState();
    if (state.roundComplete) {
      Confetti.partyFinish();
    }
    renderQuestion();
  }

  // =====================
  // Event Listeners
  // =====================
  optionLeftBtn.addEventListener("click", () => {
    handleAnswer(optionLeftBtn, true);
  });

  optionRightBtn.addEventListener("click", () => {
    handleAnswer(optionRightBtn, false);
  });

  nextBtn.addEventListener("click", () => {
    advanceQuestion();
  });

  resetBtn.addEventListener("click", () => {
    Game.reset();
    renderQuestion();
    accuracyDisplay.textContent = "0%";
    streakBadge.classList.add("hidden");
  });

  kategoriSelect.addEventListener("change", (e) => {
    Game.setKategori(e.target.value);
    renderQuestion();
    renderWordList(e.target.value);
    accuracyDisplay.textContent = "0%";
    streakBadge.classList.add("hidden");
  });

  // =====================
  // Word List Kategori Filter
  // =====================
  wordListKategori.addEventListener("change", (e) => {
    renderWordList(e.target.value);
  });

  // =====================
  // Render Word List
  // =====================
  function renderWordList(kategori) {
    const kata = getKataByKategori(kategori);
    const tbody = document.getElementById("word-list-body");
    tbody.innerHTML = "";

    kata.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td class="baku-cell">${item.baku}</td>
        <td class="tidak-baku-cell">${item.tidakBaku}</td>
        <td><span class="kategori-tag">${item.kategori}</span></td>
      `;
      tbody.appendChild(tr);
    });

    // Populate word list kategori select if not already done
    if (wordListKategori.options.length === 0) {
      KATEGORI_LIST.forEach((k) => {
        const option = document.createElement("option");
        option.value = k;
        option.textContent = k;
        wordListKategori.appendChild(option);
      });
    }

    document.getElementById("word-list-count").textContent = `${kata.length} kata`;
  }

  // =====================
  // Render Answer History
  // =====================
  function renderHistory() {
    const allHistory = Game.getHistory();
    const filter = historyFilterSelect.value;

    let filtered = allHistory;
    if (filter === "correct") {
      filtered = allHistory.filter(function (h) { return h.isCorrect; });
    } else if (filter === "wrong") {
      filtered = allHistory.filter(function (h) { return !h.isCorrect; });
    }

    // Update summary counts
    const correctTotal = allHistory.filter(function (h) { return h.isCorrect; }).length;
    const wrongTotal = allHistory.length - correctTotal;
    historyCorrectCount.textContent = correctTotal;
    historyWrongCount.textContent = wrongTotal;
    historyTotalCount.textContent = allHistory.length;
    historyCount.textContent = filtered.length + " jawaban";

    // Clear list
    historyList.innerHTML = "";

    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "history-empty";
      empty.textContent = allHistory.length === 0 ? "Belum ada riwayat jawaban." : "Tidak ada jawaban untuk filter ini.";
      historyList.appendChild(empty);
      return;
    }

    filtered.forEach(function (entry) {
      var item = document.createElement("div");
      item.className = "history-item";

      var iconClass = entry.isCorrect ? "correct" : "wrong";
      var iconSymbol = entry.isCorrect ? "✓" : "✗";

      item.innerHTML =
        '<div class="history-icon ' + iconClass + '">' + iconSymbol + '</div>' +
        '<div class="history-content">' +
          '<div class="history-word">' + escapeHtml(entry.baku) + '</div>' +
          '<div class="history-detail">Tidak baku: ' + escapeHtml(entry.tidakBaku) + '</div>' +
        '</div>' +
        '<span class="history-level-tag">Lv.' + entry.level + '</span>';

      historyList.appendChild(item);
    });
  }

  // =====================
  // Escape HTML helper
  // =====================
  function escapeHtml(text) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  // =====================
  // History Filter & Clear
  // =====================
  historyFilterSelect.addEventListener("change", function () {
    renderHistory();
  });

  clearHistoryBtn.addEventListener("click", function () {
    if (confirm("Hapus semua riwayat jawaban?")) {
      Game.clearHistory();
      renderHistory();
    }
  });

  // =====================
  // (Leaderboard and Multiplayer features hidden)
  // =====================
});
