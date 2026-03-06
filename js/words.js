// Daftar kata baku dan tidak baku berdasarkan KBBI (Kamus Besar Bahasa Indonesia)
// Setiap entri: { baku: "kata baku", tidakBaku: "kata tidak baku", kategori: "kategori" }

const KATA_DATA = [
  // === UMUM ===
  { baku: "apotek", tidakBaku: "apotik", kategori: "Umum" },
  { baku: "praktik", tidakBaku: "praktek", kategori: "Umum" },
  { baku: "analisis", tidakBaku: "analisa", kategori: "Umum" },
  { baku: "aktif", tidakBaku: "aktip", kategori: "Umum" },
  { baku: "sistem", tidakBaku: "sistim", kategori: "Umum" },
  { baku: "objek", tidakBaku: "obyek", kategori: "Umum" },
  { baku: "subjek", tidakBaku: "subyek", kategori: "Umum" },
  { baku: "teknik", tidakBaku: "tehnik", kategori: "Umum" },
  { baku: "izin", tidakBaku: "ijin", kategori: "Umum" },
  { baku: "jadwal", tidakBaku: "jadual", kategori: "Umum" },
  { baku: "risiko", tidakBaku: "resiko", kategori: "Umum" },
  { baku: "karier", tidakBaku: "karir", kategori: "Umum" },
  { baku: "nomor", tidakBaku: "nomer", kategori: "Umum" },
  { baku: "nasihat", tidakBaku: "nasehat", kategori: "Umum" },
  { baku: "hafal", tidakBaku: "hapal", kategori: "Umum" },
  { baku: "napas", tidakBaku: "nafas", kategori: "Umum" },
  { baku: "merek", tidakBaku: "merk", kategori: "Umum" },
  { baku: "miliar", tidakBaku: "milyar", kategori: "Umum" },
  { baku: "sekadar", tidakBaku: "sekedar", kategori: "Umum" },
  { baku: "silakan", tidakBaku: "silahkan", kategori: "Umum" },
  { baku: "ubah", tidakBaku: "rubah", kategori: "Umum" },
  { baku: "hakikat", tidakBaku: "hakekat", kategori: "Umum" },
  { baku: "zikir", tidakBaku: "dzikir", kategori: "Umum" },
  { baku: "azan", tidakBaku: "adzan", kategori: "Umum" },
  { baku: "asas", tidakBaku: "azas", kategori: "Umum" },
  { baku: "makhluk", tidakBaku: "mahluk", kategori: "Umum" },
  { baku: "ijazah", tidakBaku: "ijasah", kategori: "Umum" },
  { baku: "isyarat", tidakBaku: "isarat", kategori: "Umum" },
  { baku: "lembap", tidakBaku: "lembab", kategori: "Umum" },
  { baku: "teladan", tidakBaku: "tauladan", kategori: "Umum" },
  { baku: "zat", tidakBaku: "dzat", kategori: "Umum" },
  { baku: "mukjizat", tidakBaku: "mu'jizat", kategori: "Umum" },

  // === TEKNOLOGI ===
  { baku: "komputer", tidakBaku: "computer", kategori: "Teknologi" },
  { baku: "siber", tidakBaku: "cyber", kategori: "Teknologi" },
  { baku: "surel", tidakBaku: "email", kategori: "Teknologi" },
  { baku: "gawai", tidakBaku: "gadget", kategori: "Teknologi" },
  { baku: "laman", tidakBaku: "website", kategori: "Teknologi" },
  { baku: "tautan", tidakBaku: "link", kategori: "Teknologi" },
  { baku: "unduh", tidakBaku: "download", kategori: "Teknologi" },
  { baku: "unggah", tidakBaku: "upload", kategori: "Teknologi" },
  { baku: "peramban", tidakBaku: "browser", kategori: "Teknologi" },
  { baku: "sinyal", tidakBaku: "signal", kategori: "Teknologi" },

  // === PENDIDIKAN ===
  { baku: "kualitas", tidakBaku: "kwalitas", kategori: "Pendidikan" },
  { baku: "kuantitas", tidakBaku: "kwantitas", kategori: "Pendidikan" },
  { baku: "konkret", tidakBaku: "konkrit", kategori: "Pendidikan" },
  { baku: "kategori", tidakBaku: "katagori", kategori: "Pendidikan" },
  { baku: "kreatif", tidakBaku: "kreatip", kategori: "Pendidikan" },
  { baku: "variabel", tidakBaku: "veriabel", kategori: "Pendidikan" },
  { baku: "hipotesis", tidakBaku: "hipotesa", kategori: "Pendidikan" },
  { baku: "metode", tidakBaku: "metoda", kategori: "Pendidikan" },
  { baku: "prosedur", tidakBaku: "prosedure", kategori: "Pendidikan" },
  { baku: "kurikulum", tidakBaku: "kurikilum", kategori: "Pendidikan" },
  { baku: "komprehensif", tidakBaku: "komprehensi", kategori: "Pendidikan" },
  { baku: "eksklusif", tidakBaku: "eksklusip", kategori: "Pendidikan" },

  // === KESEHATAN ===
  { baku: "atlet", tidakBaku: "atlit", kategori: "Kesehatan" },
  { baku: "ambulans", tidakBaku: "ambulan", kategori: "Kesehatan" },
  { baku: "influenza", tidakBaku: "inflenza", kategori: "Kesehatan" },
  { baku: "diabetes", tidakBaku: "diabites", kategori: "Kesehatan" },
  { baku: "klorofil", tidakBaku: "chlorofil", kategori: "Kesehatan" },
  { baku: "vitamin", tidakBaku: "witamin", kategori: "Kesehatan" },
  { baku: "vaksin", tidakBaku: "vaccine", kategori: "Kesehatan" },
  { baku: "operasi", tidakBaku: "oprasi", kategori: "Kesehatan" },
  { baku: "diagnosis", tidakBaku: "diagnosa", kategori: "Kesehatan" },

  // === PEMERINTAHAN ===
  { baku: "provinsi", tidakBaku: "propinsi", kategori: "Pemerintahan" },
  { baku: "desain", tidakBaku: "disain", kategori: "Pemerintahan" },
  { baku: "ekspor", tidakBaku: "eksport", kategori: "Pemerintahan" },
  { baku: "impor", tidakBaku: "import", kategori: "Pemerintahan" },
  { baku: "paspor", tidakBaku: "pasport", kategori: "Pemerintahan" },
  { baku: "proyek", tidakBaku: "projek", kategori: "Pemerintahan" },
  { baku: "jenderal", tidakBaku: "jendral", kategori: "Pemerintahan" },
  { baku: "formal", tidakBaku: "formil", kategori: "Pemerintahan" },
  { baku: "inisiatif", tidakBaku: "initiativ", kategori: "Pemerintahan" },
  { baku: "interogasi", tidakBaku: "interrogasi", kategori: "Pemerintahan" },
  { baku: "efektif", tidakBaku: "efektip", kategori: "Pemerintahan" },
  { baku: "negatif", tidakBaku: "negatip", kategori: "Pemerintahan" },

  // === SEHARI-HARI ===
  { baku: "bus", tidakBaku: "bis", kategori: "Sehari-hari" },
  { baku: "telepon", tidakBaku: "tilpun", kategori: "Sehari-hari" },
  { baku: "foto", tidakBaku: "photo", kategori: "Sehari-hari" },
  { baku: "baterai", tidakBaku: "batere", kategori: "Sehari-hari" },
  { baku: "kedaluwarsa", tidakBaku: "kadaluarsa", kategori: "Sehari-hari" },
  { baku: "nuklir", tidakBaku: "nuklier", kategori: "Sehari-hari" },
  { baku: "modern", tidakBaku: "moderen", kategori: "Sehari-hari" },
  { baku: "November", tidakBaku: "Nopember", kategori: "Sehari-hari" },
  { baku: "Sabtu", tidakBaku: "Saptu", kategori: "Sehari-hari" },
  { baku: "imajinasi", tidakBaku: "imaginasi", kategori: "Sehari-hari" },
  { baku: "energi", tidakBaku: "enerji", kategori: "Sehari-hari" },
  { baku: "misi", tidakBaku: "missi", kategori: "Sehari-hari" },
  { baku: "cendekiawan", tidakBaku: "cendikiawan", kategori: "Sehari-hari" },
  { baku: "legalisasi", tidakBaku: "legalisir", kategori: "Sehari-hari" },
  { baku: "konsekuensi", tidakBaku: "konsekwensi", kategori: "Sehari-hari" },
  { baku: "kuota", tidakBaku: "kwota", kategori: "Sehari-hari" },
];

// Daftar semua kategori unik
const KATEGORI_LIST = ["Semua", ...new Set(KATA_DATA.map((item) => item.kategori))];

// Fungsi untuk mendapatkan kata berdasarkan kategori
function getKataByKategori(kategori) {
  if (kategori === "Semua") return KATA_DATA;
  return KATA_DATA.filter((item) => item.kategori === kategori);
}

// Fungsi untuk mengacak urutan array
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
