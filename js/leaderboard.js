// Leaderboard module using localStorage

const Leaderboard = (function () {
  const STORAGE_KEY = "kataBakuLeaderboard";
  const MAX_ENTRIES = 10;

  function getEntries() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  // Add a new score to the leaderboard
  function addScore(name, score, accuracy) {
    const entries = getEntries();
    entries.push({
      name: name,
      score: score,
      accuracy: accuracy,
      date: new Date().toLocaleDateString("id-ID"),
    });

    // Sort by score descending, then by accuracy descending
    entries.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return b.accuracy - a.accuracy;
    });

    // Keep only top entries
    if (entries.length > MAX_ENTRIES) {
      entries.length = MAX_ENTRIES;
    }

    saveEntries(entries);
    return entries;
  }

  // Check if a score qualifies for the leaderboard
  function qualifies(score) {
    if (score <= 0) return false;
    const entries = getEntries();
    if (entries.length < MAX_ENTRIES) return true;
    return score > entries[entries.length - 1].score;
  }

  // Clear the leaderboard
  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    getEntries: getEntries,
    addScore: addScore,
    qualifies: qualifies,
    clear: clear,
  };
})();
