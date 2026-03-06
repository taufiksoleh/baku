// Online multiplayer module using PeerJS (WebRTC peer-to-peer)

const Multiplayer = (function () {
  let peer = null;
  let conn = null;
  let isHost = false;
  let roomId = null;
  let playerName = "";
  let opponentName = "";
  let myScore = 0;
  let opponentScore = 0;
  let questionIndex = 0;
  let questions = [];
  let totalRounds = 10;
  let myAnswered = false;
  let opponentAnswered = false;
  let onStateChange = null;
  let active = false;
  let myCorrect = 0;
  let opponentCorrect = 0;

  function generateRoomId() {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var result = "";
    for (var i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function initPeer(callback) {
    if (peer && !peer.destroyed) {
      callback();
      return;
    }
    peer = new Peer();
    peer.on("open", function () {
      callback();
    });
    peer.on("error", function (err) {
      if (onStateChange) {
        onStateChange({ type: "error", message: "Koneksi gagal: " + err.type });
      }
    });
  }

  function setupConnection() {
    conn.on("data", function (data) {
      handleMessage(data);
    });
    conn.on("close", function () {
      if (active) {
        active = false;
        if (onStateChange) {
          onStateChange({ type: "disconnected", message: "Lawan terputus dari permainan" });
        }
      }
    });
  }

  function handleMessage(data) {
    switch (data.type) {
      case "join":
        opponentName = data.name;
        // Host sends game start with questions
        if (isHost) {
          prepareQuestions();
          conn.send({
            type: "start",
            name: playerName,
            questions: questions,
            totalRounds: totalRounds,
          });
          if (onStateChange) {
            onStateChange({ type: "game_start", opponent: opponentName });
          }
          sendQuestion();
        }
        break;
      case "start":
        opponentName = data.name;
        questions = data.questions;
        totalRounds = data.totalRounds;
        if (onStateChange) {
          onStateChange({ type: "game_start", opponent: opponentName });
        }
        sendQuestion();
        break;
      case "question":
        questionIndex = data.index;
        myAnswered = false;
        opponentAnswered = false;
        if (onStateChange) {
          onStateChange({
            type: "question",
            question: questions[questionIndex],
            index: questionIndex,
            total: totalRounds,
            optionLeft: data.optionLeft,
            optionRight: data.optionRight,
          });
        }
        break;
      case "answered":
        opponentAnswered = true;
        opponentScore = data.score;
        opponentCorrect = data.correct;
        if (onStateChange) {
          onStateChange({
            type: "opponent_answered",
            opponentScore: opponentScore,
          });
        }
        // If both answered, advance
        if (myAnswered && opponentAnswered) {
          advanceRound();
        }
        break;
      case "next_question":
        sendQuestion();
        break;
      case "game_over":
        if (onStateChange) {
          onStateChange({
            type: "game_over",
            myScore: myScore,
            opponentScore: data.score,
            opponentName: opponentName,
            myCorrect: myCorrect,
            opponentCorrect: data.correct,
          });
        }
        break;
    }
  }

  function prepareQuestions() {
    var allKata = KATA_DATA.slice();
    // Shuffle
    for (var i = allKata.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = allKata[i];
      allKata[i] = allKata[j];
      allKata[j] = temp;
    }
    questions = allKata.slice(0, totalRounds);
  }

  function sendQuestion() {
    if (questionIndex >= totalRounds) {
      // Game over
      conn.send({
        type: "game_over",
        score: myScore,
        correct: myCorrect,
      });
      if (onStateChange) {
        onStateChange({
          type: "game_over",
          myScore: myScore,
          opponentScore: opponentScore,
          opponentName: opponentName,
          myCorrect: myCorrect,
          opponentCorrect: opponentCorrect,
        });
      }
      return;
    }
    myAnswered = false;
    opponentAnswered = false;

    var q = questions[questionIndex];
    var optionLeft, optionRight;
    if (Math.random() < 0.5) {
      optionLeft = { text: q.baku, isBaku: true };
      optionRight = { text: q.tidakBaku, isBaku: false };
    } else {
      optionLeft = { text: q.tidakBaku, isBaku: false };
      optionRight = { text: q.baku, isBaku: true };
    }

    conn.send({
      type: "question",
      index: questionIndex,
      optionLeft: optionLeft,
      optionRight: optionRight,
    });

    if (onStateChange) {
      onStateChange({
        type: "question",
        question: q,
        index: questionIndex,
        total: totalRounds,
        optionLeft: optionLeft,
        optionRight: optionRight,
      });
    }
  }

  function advanceRound() {
    questionIndex++;
    setTimeout(function () {
      if (isHost) {
        sendQuestion();
        conn.send({ type: "next_question" });
      }
    }, 2000);
  }

  // Public API
  function createRoom(name, callback) {
    playerName = name;
    isHost = true;
    myScore = 0;
    opponentScore = 0;
    myCorrect = 0;
    opponentCorrect = 0;
    questionIndex = 0;
    active = true;

    initPeer(function () {
      roomId = generateRoomId();
      var fullRoomId = "kataBaku_" + roomId;

      // Destroy existing peer and create with custom ID
      peer.destroy();
      peer = new Peer(fullRoomId);
      peer.on("open", function () {
        peer.on("connection", function (connection) {
          conn = connection;
          setupConnection();
          conn.on("open", function () {
            // Connection established, wait for join message
          });
        });

        if (callback) callback(roomId);
      });
      peer.on("error", function (err) {
        if (onStateChange) {
          onStateChange({ type: "error", message: "Gagal membuat room: " + err.type });
        }
      });
    });
  }

  function joinRoom(code, name, callback) {
    playerName = name;
    isHost = false;
    roomId = code.toUpperCase().trim();
    myScore = 0;
    opponentScore = 0;
    myCorrect = 0;
    opponentCorrect = 0;
    questionIndex = 0;
    active = true;

    initPeer(function () {
      var fullRoomId = "kataBaku_" + roomId;
      conn = peer.connect(fullRoomId, { reliable: true });

      conn.on("open", function () {
        setupConnection();
        conn.send({ type: "join", name: playerName });
        if (callback) callback();
      });
      conn.on("error", function (err) {
        if (onStateChange) {
          onStateChange({ type: "error", message: "Gagal bergabung: " + err.type });
        }
      });
    });
  }

  function submitAnswer(isCorrect) {
    if (myAnswered) return;
    myAnswered = true;

    if (isCorrect) {
      myScore += 10;
      myCorrect++;
    }

    conn.send({
      type: "answered",
      score: myScore,
      correct: myCorrect,
    });

    if (myAnswered && opponentAnswered) {
      advanceRound();
    }

    return { myScore: myScore, isCorrect: isCorrect };
  }

  function setOnStateChange(cb) {
    onStateChange = cb;
  }

  function disconnect() {
    active = false;
    if (conn) {
      conn.close();
      conn = null;
    }
    if (peer) {
      peer.destroy();
      peer = null;
    }
    myScore = 0;
    opponentScore = 0;
    myCorrect = 0;
    opponentCorrect = 0;
    questionIndex = 0;
  }

  function isActive() {
    return active;
  }

  function getPlayerName() {
    return playerName;
  }

  function getOpponentName() {
    return opponentName;
  }

  return {
    createRoom: createRoom,
    joinRoom: joinRoom,
    submitAnswer: submitAnswer,
    setOnStateChange: setOnStateChange,
    disconnect: disconnect,
    isActive: isActive,
    getPlayerName: getPlayerName,
    getOpponentName: getOpponentName,
  };
})();
