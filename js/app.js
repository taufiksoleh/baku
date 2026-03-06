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
  const wordListContainer = document.getElementById("word-list-container");
  const wordListToggle = document.getElementById("word-list-toggle");
  const wordListContent = document.getElementById("word-list-content");
  const wordListKategori = document.getElementById("word-list-kategori");
  const progressBar = document.getElementById("progress-bar");

  let awaitingNext = false;

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
      streakBadge.textContent = `🔥 ${state.streak}x Streak!`;
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
      feedbackText.textContent = "✅ Benar!";

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
        streakBadge.textContent = `🔥 ${newState.streak}x Streak!`;
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
      feedbackText.textContent = "❌ Salah!";
      feedbackDetail.textContent = `Kata baku yang benar adalah "${result.correctWord}" (bukan "${result.incorrectWord}"). -5 poin`;

      streakBadge.classList.add("hidden");
      streakDisplay.textContent = "0";
      accuracyDisplay.textContent = Game.getAccuracy() + "%";
      scoreDisplay.textContent = result.score;
    }

    feedbackEl.classList.remove("hidden");
    nextBtn.classList.remove("hidden");

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
  // Word List Toggle
  // =====================
  wordListToggle.addEventListener("click", () => {
    const isHidden = wordListContent.classList.contains("hidden");
    if (isHidden) {
      wordListContent.classList.remove("hidden");
      wordListToggle.textContent = "📚 Sembunyikan Daftar Kata ▲";
    } else {
      wordListContent.classList.add("hidden");
      wordListToggle.textContent = "📚 Lihat Daftar Kata ▼";
    }
  });

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
  // (Leaderboard and Multiplayer features hidden)
  // =====================
});
