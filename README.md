# routster-get

Landing page + one-liner installer untuk [Routster Agent](https://github.com/ArzakaRaffan/routster-agent),
untuk **https://get.routster.trackster.dev**. Situsnya static: cukup serve folder `site/`.

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
| `.github/workflows/check.yml` | Cek wrapper end to end + link lokal (push, PR, harian, manual). Tidak deploy. |

Installer aslinya tetap satu sumber di `routster-agent/scripts/`. Wrapper di sini nggak perlu diubah
kalau installer berubah.

## Design system

`routster.css` adalah salinan. Sumber kebenarannya `routster/web/assets/routster.css` (lihat
`routster/web/DESIGN.md`). Kalau token di sana berubah, salin ulang:

```bash
cp ../routster/web/assets/routster.css site/assets/routster.css
```

`get.css` hanya memakai token (`var(--…)`), jadi otomatis ikut light/dark.

## Bahasa (ID / EN)

Teks Indonesia ada di markup, teks Inggris di atribut `data-en` di elemen yang sama (boleh berisi
HTML ter-escape). Teks yang diketik di terminal pakai `data-text` + `data-text-en`. Bahasa dipilih
dari `?lang=`, lalu `localStorage["routster.locale"]`, lalu bahasa browser.

## Preview lokal

```bash
python -m http.server 4173 -d site
```

## Deploy ke VPS

Serve `site/` apa adanya, tanpa build. Contoh nginx:

```nginx
server {
  server_name get.routster.trackster.dev;
  root /var/www/routster-get/site;
  location / { try_files $uri $uri/ =404; }
  location ~ \.(sh|ps1)$ { default_type text/plain; add_header Cache-Control "no-cache"; }
}
```

DNS: record `A` `get.routster` → IP VPS (di zona `trackster.dev`), lalu pasang HTTPS
(misalnya `certbot --nginx -d get.routster.trackster.dev`). Perintah instal butuh HTTPS.

Angka multiplier di demo `routster model` diambil dari `/v1/models` pada 6 November 2026. Itu cuma
ilustrasi. Angka live selalu ada di `routster model`.
