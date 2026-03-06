// Share score as image using Canvas API and Web Share API

const Share = (function () {
  // Generate score card image as canvas
  function generateScoreCanvas() {
    const state = Game.getState();
    const accuracy = Game.getAccuracy();
    const canvas = document.createElement("canvas");
    const w = 600;
    const h = 400;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, "#007AFF");
    bgGrad.addColorStop(1, "#5856D6");
    ctx.fillStyle = bgGrad;
    roundRect(ctx, 0, 0, w, h, 24);
    ctx.fill();

    // Inner card
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    roundRect(ctx, 20, 20, w - 40, h - 40, 16);
    ctx.fill();

    // Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Kata Baku vs Tidak Baku", w / 2, 68);

    // Subtitle
    ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("Game KBBI — Skor Saya", w / 2, 96);

    // Divider line
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 116);
    ctx.lineTo(w - 60, 116);
    ctx.stroke();

    // Score - big center number
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 72px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillText(state.score, w / 2, 196);

    ctx.font = "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("POIN", w / 2, 222);

    // Stats row
    var statsY = 276;
    var statSpacing = w / 4;
    var stats = [
      { label: "Level", value: String(state.level) },
      { label: "Rekor", value: String(state.highScore) },
      { label: "Streak", value: String(state.bestStreak) + "x" },
      { label: "Akurasi", value: accuracy + "%" },
    ];

    stats.forEach(function (stat, i) {
      var x = statSpacing * i + statSpacing / 2;

      // Stat value
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.fillText(stat.value, x, statsY);

      // Stat label
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.fillText(stat.label, x, statsY + 22);
    });

    // Footer
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillText("Uji pengetahuanmu di kbbi.kemendikdasmen.go.id", w / 2, h - 32);

    return canvas;
  }

  // Helper: draw rounded rectangle
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // Convert canvas to blob
  function canvasToBlob(canvas) {
    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) {
        resolve(blob);
      }, "image/png");
    });
  }

  // Share score
  function shareScore() {
    var canvas = generateScoreCanvas();

    canvasToBlob(canvas).then(function (blob) {
      var file = new File([blob], "kata-baku-score.png", { type: "image/png" });

      // Try Web Share API with file support
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          title: "Kata Baku vs Tidak Baku",
          text: "Skor saya di game Kata Baku: " + Game.getState().score + " poin!",
          files: [file],
        }).catch(function () {
          // User cancelled or share failed — silent
        });
      } else {
        // Fallback: download the image
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "kata-baku-score.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  }

  return {
    shareScore: shareScore,
  };
})();
