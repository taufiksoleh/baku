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

  // Leaderboard elements
  const lbToggle = document.getElementById("lb-toggle");
  const lbContent = document.getElementById("lb-content");
  const lbBody = document.getElementById("lb-body");
  const lbNameInput = document.getElementById("lb-name");
  const lbSaveBtn = document.getElementById("lb-save-btn");
  const lbClearBtn = document.getElementById("lb-clear-btn");

  // Multiplayer elements
  const mpToggle = document.getElementById("mp-toggle");
  const mpContent = document.getElementById("mp-content");
  const mpLobby = document.getElementById("mp-lobby");
  const mpGame = document.getElementById("mp-game");
  const mpResult = document.getElementById("mp-result");
  const mpNameInput = document.getElementById("mp-name");
  const mpCreateBtn = document.getElementById("mp-create-btn");
  const mpJoinBtn = document.getElementById("mp-join-btn");
  const mpRoomCodeInput = document.getElementById("mp-room-code");
  const mpStatus = document.getElementById("mp-status");
  const mpMyName = document.getElementById("mp-my-name");
  const mpOppName = document.getElementById("mp-opp-name");
  const mpMyScore = document.getElementById("mp-my-score");
  const mpOppScore = document.getElementById("mp-opp-score");
  const mpRoundInfo = document.getElementById("mp-round-info");
  const mpOptionLeft = document.getElementById("mp-option-left");
  const mpOptionRight = document.getElementById("mp-option-right");
  const mpFeedback = document.getElementById("mp-feedback");
  const mpFeedbackText = document.getElementById("mp-feedback-text");
  const mpLeaveBtn = document.getElementById("mp-leave-btn");
  const mpPlayAgainBtn = document.getElementById("mp-play-again-btn");

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
  renderLeaderboard();

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
  // Leaderboard
  // =====================
  lbToggle.addEventListener("click", () => {
    const isHidden = lbContent.classList.contains("hidden");
    if (isHidden) {
      lbContent.classList.remove("hidden");
      lbToggle.textContent = "🏆 Leaderboard ▲";
    } else {
      lbContent.classList.add("hidden");
      lbToggle.textContent = "🏆 Leaderboard ▼";
    }
  });

  lbSaveBtn.addEventListener("click", () => {
    const name = lbNameInput.value.trim();
    if (!name) {
      lbNameInput.focus();
      return;
    }
    const state = Game.getState();
    Leaderboard.addScore(name, state.score, Game.getAccuracy());
    renderLeaderboard();
    lbNameInput.value = "";
  });

  lbClearBtn.addEventListener("click", () => {
    Leaderboard.clear();
    renderLeaderboard();
  });

  function renderLeaderboard() {
    const entries = Leaderboard.getEntries();
    lbBody.innerHTML = "";

    if (entries.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = '<td colspan="5" class="lb-empty">Belum ada skor tersimpan</td>';
      lbBody.appendChild(tr);
      return;
    }

    entries.forEach((entry, index) => {
      const tr = document.createElement("tr");
      const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;
      tr.innerHTML =
        "<td>" + medal + "</td>" +
        "<td><strong>" + entry.name + "</strong></td>" +
        "<td class=\"lb-score\">" + entry.score + "</td>" +
        "<td>" + entry.accuracy + "%</td>" +
        "<td>" + entry.date + "</td>";
      lbBody.appendChild(tr);
    });
  }

  // =====================
  // Multiplayer
  // =====================
  let mpCurrentOptions = null;
  let mpAwaitingNext = false;

  mpToggle.addEventListener("click", () => {
    const isHidden = mpContent.classList.contains("hidden");
    if (isHidden) {
      mpContent.classList.remove("hidden");
      mpToggle.textContent = "🌐 Mode Multiplayer ▲";
    } else {
      mpContent.classList.add("hidden");
      mpToggle.textContent = "🌐 Mode Multiplayer ▼";
    }
  });

  mpCreateBtn.addEventListener("click", () => {
    const name = mpNameInput.value.trim();
    if (!name) {
      mpNameInput.focus();
      return;
    }
    mpStatus.classList.remove("hidden");
    mpStatus.textContent = "⏳ Membuat room...";
    mpCreateBtn.disabled = true;

    Multiplayer.createRoom(name, function (roomId) {
      mpStatus.innerHTML = "✅ Room dibuat! Kode: <strong class=\"mp-room-id\">" + roomId + "</strong><br>Bagikan kode ini ke lawan dan tunggu mereka bergabung...";
    });
  });

  mpJoinBtn.addEventListener("click", () => {
    const name = mpNameInput.value.trim();
    const code = mpRoomCodeInput.value.trim();
    if (!name) {
      mpNameInput.focus();
      return;
    }
    if (!code) {
      mpRoomCodeInput.focus();
      return;
    }
    mpStatus.classList.remove("hidden");
    mpStatus.textContent = "⏳ Menghubungkan...";
    mpJoinBtn.disabled = true;

    Multiplayer.joinRoom(code, name, function () {
      mpStatus.textContent = "✅ Terhubung! Menunggu permainan dimulai...";
    });
  });

  mpLeaveBtn.addEventListener("click", () => {
    Multiplayer.disconnect();
    resetMpUI();
  });

  mpPlayAgainBtn.addEventListener("click", () => {
    Multiplayer.disconnect();
    resetMpUI();
  });

  function resetMpUI() {
    mpLobby.classList.remove("hidden");
    mpGame.classList.add("hidden");
    mpResult.classList.add("hidden");
    mpStatus.classList.add("hidden");
    mpCreateBtn.disabled = false;
    mpJoinBtn.disabled = false;
    mpMyScore.textContent = "0";
    mpOppScore.textContent = "0";
  }

  mpOptionLeft.addEventListener("click", () => {
    handleMpAnswer(mpOptionLeft, true);
  });

  mpOptionRight.addEventListener("click", () => {
    handleMpAnswer(mpOptionRight, false);
  });

  function handleMpAnswer(chosenBtn, isLeft) {
    if (mpAwaitingNext) return;
    mpAwaitingNext = true;

    const isBaku = isLeft ? mpCurrentOptions.optionLeft.isBaku : mpCurrentOptions.optionRight.isBaku;
    const result = Multiplayer.submitAnswer(isBaku);

    mpOptionLeft.disabled = true;
    mpOptionRight.disabled = true;

    if (result.isCorrect) {
      Sound.playCorrect();
      chosenBtn.classList.add("correct");
      mpFeedback.className = "feedback correct";
      mpFeedbackText.textContent = "✅ Benar! +10 poin";
    } else {
      Sound.playWrong();
      chosenBtn.classList.add("wrong");
      // Highlight correct one
      if (isLeft) {
        mpOptionRight.classList.add("correct");
      } else {
        mpOptionLeft.classList.add("correct");
      }
      mpFeedback.className = "feedback wrong";
      mpFeedbackText.textContent = "❌ Salah!";
    }
    mpFeedback.classList.remove("hidden");
    mpMyScore.textContent = result.myScore;
  }

  // Multiplayer state handler
  Multiplayer.setOnStateChange(function (event) {
    switch (event.type) {
      case "game_start":
        mpLobby.classList.add("hidden");
        mpGame.classList.remove("hidden");
        mpResult.classList.add("hidden");
        mpMyName.textContent = Multiplayer.getPlayerName();
        mpOppName.textContent = event.opponent;
        mpRoundInfo.textContent = "Permainan dimulai!";
        break;

      case "question":
        mpAwaitingNext = false;
        mpCurrentOptions = {
          optionLeft: event.optionLeft,
          optionRight: event.optionRight,
        };
        mpOptionLeft.textContent = event.optionLeft.text;
        mpOptionRight.textContent = event.optionRight.text;
        mpOptionLeft.className = "option-btn";
        mpOptionRight.className = "option-btn";
        mpOptionLeft.disabled = false;
        mpOptionRight.disabled = false;
        mpFeedback.classList.add("hidden");
        mpFeedback.className = "feedback hidden";
        mpRoundInfo.textContent = "Soal " + (event.index + 1) + " dari " + event.total;
        break;

      case "opponent_answered":
        mpOppScore.textContent = event.opponentScore;
        break;

      case "game_over":
        mpGame.classList.add("hidden");
        mpResult.classList.remove("hidden");

        var myName = Multiplayer.getPlayerName();
        document.getElementById("mp-result-my-name").textContent = myName;
        document.getElementById("mp-result-my-score").textContent = event.myScore;
        document.getElementById("mp-result-my-detail").textContent = event.myCorrect + " benar";
        document.getElementById("mp-result-opp-name").textContent = event.opponentName;
        document.getElementById("mp-result-opp-score").textContent = event.opponentScore;
        document.getElementById("mp-result-opp-detail").textContent = event.opponentCorrect + " benar";

        var resultTitle = document.getElementById("mp-result-title");
        if (event.myScore > event.opponentScore) {
          resultTitle.textContent = "🎉 Kamu Menang!";
          Sound.playCorrect();
        } else if (event.myScore < event.opponentScore) {
          resultTitle.textContent = "😔 Kamu Kalah!";
          Sound.playWrong();
        } else {
          resultTitle.textContent = "🤝 Seri!";
        }
        break;

      case "disconnected":
        mpGame.classList.add("hidden");
        mpResult.classList.add("hidden");
        mpLobby.classList.remove("hidden");
        mpStatus.classList.remove("hidden");
        mpStatus.textContent = "⚠️ " + event.message;
        mpCreateBtn.disabled = false;
        mpJoinBtn.disabled = false;
        break;

      case "error":
        mpStatus.classList.remove("hidden");
        mpStatus.textContent = "❌ " + event.message;
        mpCreateBtn.disabled = false;
        mpJoinBtn.disabled = false;
        break;
    }
  });
});
