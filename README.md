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

### Hosting di GitHub Pages

Proyek ini otomatis di-deploy ke GitHub Pages melalui GitHub Actions setiap kali ada push ke branch `main`.

1. Buka **Settings → Pages** di repositori GitHub Anda
2. Di bagian **Source**, pilih **GitHub Actions**
3. Push perubahan ke branch `main` — deploy akan berjalan otomatis
4. Akses situs Anda di `https://<username>.github.io/baku-tidalbaku/`

## 📁 Struktur File

```
baku-tidalbaku/
├── index.html          # Halaman utama game
├── css/
│   └── style.css       # Tampilan & styling (mobile-first)
├── js/
│   ├── words.js        # Data kata baku/tidak baku dari KBBI
│   ├── game.js         # Logika permainan & sistem poin
│   └── app.js          # Inisialisasi UI & event handler
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Pages deployment pipeline
└── README.md
```

## 📖 Referensi

Semua kata berdasarkan **KBBI (Kamus Besar Bahasa Indonesia)** — [kbbi.kemendikdasmen.go.id](https://kbbi.kemendikdasmen.go.id/Beranda)