# Kata Baku vs Tidak Baku 📖

Game kuis interaktif untuk menguji pengetahuanmu tentang **kata baku dan tidak baku** berdasarkan **KBBI (Kamus Besar Bahasa Indonesia)**.

## 🎮 Cara Bermain

1. Dua pilihan kata ditampilkan di layar
2. Pilih mana yang merupakan **kata baku** yang benar menurut KBBI
3. Kumpulkan poin dari setiap jawaban benar
4. Streak jawaban benar berturut-turut memberikan **bonus poin**!

## 🏆 Sistem Poin

| Kondisi | Poin |
|---|---|
| Jawaban benar | +10 |
| Streak 3x berturut-turut | +20 |
| Streak 5x berturut-turut | +30 |
| Jawaban salah | -5 |

## 📂 Kategori Kata

- **Umum** — Kata-kata umum sehari-hari
- **Teknologi** — Istilah teknologi & digital
- **Pendidikan** — Istilah akademis & ilmiah
- **Kesehatan** — Istilah medis & kesehatan
- **Pemerintahan** — Istilah pemerintahan & hukum
- **Sehari-hari** — Kata-kata dalam percakapan sehari-hari

## 🚀 Cara Menjalankan

Buka file `index.html` di browser — tidak memerlukan server atau instalasi apapun!

```
git clone https://github.com/taufiksoleh/baku-tidalbaku.git
cd baku-tidalbaku
# Buka index.html di browser
```

## 📁 Struktur File

```
baku-tidalbaku/
├── index.html          # Halaman utama game
├── css/
│   └── style.css       # Tampilan & styling
├── js/
│   ├── words.js        # Data kata baku/tidak baku dari KBBI
│   ├── game.js         # Logika permainan & sistem poin
│   └── app.js          # Inisialisasi UI & event handler
└── README.md
```

## 📖 Referensi

Semua kata berdasarkan **KBBI (Kamus Besar Bahasa Indonesia)** — [kbbi.kemdikbud.go.id](https://kbbi.kemdikbud.go.id)