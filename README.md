# Kata Baku vs Tidak Baku 📖

Game kuis interaktif untuk menguji pengetahuanmu tentang **kata baku dan tidak baku** berdasarkan **KBBI (Kamus Besar Bahasa Indonesia)**.

Dibangun dengan **Nuxt 4** dan **Nuxt UI**, dioptimalkan untuk pengalaman mobile.

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

```bash
git clone https://github.com/taufiksoleh/baku.git
cd baku
npm install
npm run dev
```

### Build untuk Produksi

```bash
npm run generate
```

### Hosting di GitHub Pages

Proyek ini otomatis di-deploy ke GitHub Pages melalui GitHub Actions setiap kali ada push ke branch `main`.

1. Buka **Settings → Pages** di repositori GitHub Anda
2. Di bagian **Source**, pilih **GitHub Actions**
3. Push perubahan ke branch `main` — deploy akan berjalan otomatis

## 📁 Struktur File

```
baku/
├── app/
│   ├── app.vue              # Layout utama dengan bottom navigation
│   ├── app.config.ts        # Konfigurasi tema Nuxt UI
│   ├── assets/css/main.css  # Global styles (Tailwind + Nuxt UI)
│   ├── components/
│   │   ├── GameView.vue     # Komponen game utama
│   │   ├── HowToPlay.vue    # Panduan cara bermain
│   │   └── WordList.vue     # Daftar kata baku/tidak baku
│   └── composables/
│       ├── words.ts         # Data kata dari KBBI
│       ├── useGame.ts       # Logika permainan & scoring
│       └── useSound.ts      # Efek suara (Web Audio API)
├── nuxt.config.ts           # Konfigurasi Nuxt
├── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages deployment
└── README.md
```

## 📖 Referensi

Semua kata berdasarkan **KBBI (Kamus Besar Bahasa Indonesia)** — [kbbi.kemendikdasmen.go.id](https://kbbi.kemendikdasmen.go.id)