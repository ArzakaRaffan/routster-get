# routster-get

Landing page + one-liner installer untuk [Routster Agent](https://github.com/ArzakaRaffan/routster-agent),
di-serve di **https://get.routster.trackster.dev** lewat GitHub Pages.

```bash
curl -fsSL https://get.routster.trackster.dev/install.sh | bash          # macOS / Linux / WSL
irm https://get.routster.trackster.dev/install.ps1 | iex                  # Windows PowerShell
```

## Isi

| File | Fungsi |
|---|---|
| `site/index.html` | Halaman (static, tanpa build step) |
| `site/assets/routster.css` | Salinan design system dari `routster/web/assets/routster.css` |
| `site/assets/get.css`, `get.js` | Style dan interaksi khusus halaman ini |
| `site/install.sh`, `install.ps1` | Wrapper kecil yang selalu menjalankan installer terbaru dari `main` repo `routster-agent` |
| `.github/workflows/pages.yml` | Cek wrapper end to end, lalu deploy ke Pages (push ke `main`, harian, manual) |

Installer aslinya tetap satu sumber di `routster-agent/scripts/`. Wrapper di sini nggak perlu diubah
kalau installer berubah.

## Design system

`routster.css` adalah salinan. Sumber kebenarannya `routster/web/assets/routster.css` (lihat
`routster/web/DESIGN.md`). Kalau token di sana berubah, salin ulang:

```bash
cp ../routster/web/assets/routster.css site/assets/routster.css
```

`get.css` hanya memakai token (`var(--…)`), jadi otomatis ikut light/dark.

## Preview lokal

```bash
python -m http.server 4173 -d site
```

## Setup sekali (sudah/perlu dilakukan)

1. Repo → Settings → Pages → Source: **GitHub Actions**.
2. DNS: record `CNAME` `get.routster` → `arzakaraffan.github.io` (di zona `trackster.dev`).
   Kalau pakai Cloudflare, set **DNS only** (awan abu-abu) sampai sertifikat Pages terbit.
3. Settings → Pages → Custom domain `get.routster.trackster.dev`, lalu centang **Enforce HTTPS**.

Angka multiplier di demo `routster model` diambil dari `/v1/models` pada 6 November 2026. Itu cuma
ilustrasi. Angka live selalu ada di `routster model`.
