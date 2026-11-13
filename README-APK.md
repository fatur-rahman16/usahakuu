# Kit Build APK UsahaKu — Capacitor + GitHub Actions

## Penting: kit ini adalah tambahan untuk repository UsahaKu yang sudah ada
Jangan hapus atau ganti `index.html`, `style.css`, `app.js`, file gambar, font,
data, atau aset lain milik aplikasi. Salin isi folder kit ini ke ROOT repository
UsahaKu, sehingga file kit bergabung dengan file aplikasi yang sudah ada.

## Struktur yang diharapkan setelah digabung

```text
repository-usahaku/
├── index.html                 # file aplikasi yang sudah ada
├── style.css                  # file aplikasi yang sudah ada
├── app.js                     # file aplikasi yang sudah ada
├── manifest.webmanifest       # jika sudah ada
├── sw.js                      # jika sudah ada
├── icon-192.png               # jika sudah ada
├── icon-512.png               # jika sudah ada
├── assets/                    # folder aset lain jika ada
├── package.json               # dari kit
├── capacitor.config.json      # dari kit
├── .gitignore                 # dari kit
├── README-APK.md              # dari kit
├── scripts/
│   └── prepare-web.mjs
└── .github/
    └── workflows/
        └── build-apk.yml
```

Folder `www/` dan `android/` dibuat otomatis oleh GitHub Actions saat build.
Keduanya tidak perlu diunggah.

## Cara upload lewat eCode Android

1. Ekstrak ZIP ini di HP.
2. Buka repository UsahaKu di GitHub.
3. Upload/gabungkan isi folder ZIP ke ROOT repository (bukan membuat folder
   `UsahaKu-APK-GitHub-Kit` di dalam repository).
4. Pastikan `index.html` tetap berada di root repository, sejajar dengan
   `package.json`.
5. Commit perubahan ke branch `main` atau `master`.

Jika eCode mengelola file lokal repository, salin folder `.github`, `scripts`,
serta file `package.json`, `capacitor.config.json`, `.gitignore`, dan
`README-APK.md` ke root proyek. Jangan menimpa file aplikasi yang sudah ada.

## Menjalankan build

1. Buka repository GitHub.
2. Pilih tab **Actions**.
3. Pilih workflow **Build APK UsahaKu**.
4. Tekan **Run workflow** jika belum berjalan otomatis.
5. Tunggu sampai job berstatus hijau.
6. Buka hasil run, cari bagian **Artifacts**, lalu unduh
   `UsahaKu-debug-APK`.
7. Ekstrak ZIP artifact dan ambil `app-debug.apk`.

## Catatan penting

- Build pertama membuat proyek Android sementara di runner GitHub.
- APK ini adalah debug APK untuk uji coba, bukan APK release bertanda tangan
  untuk distribusi resmi.
- Jangan menghapus data aplikasi/browser lama sebelum backup diuji.
- `localStorage` dari website dan aplikasi Android berada pada penyimpanan
  WebView yang berbeda. Data website tidak otomatis berpindah ke APK.
  Gunakan fitur ekspor/backup UsahaKu lalu uji pemulihannya di APK.
- Data lokal pada APK biasanya tetap ada saat APK diperbarui dengan application
  ID yang sama, tetapi dapat hilang jika aplikasi di-uninstall atau data aplikasi
  dihapus.
- `appId` di `capacitor.config.json` adalah identitas permanen aplikasi Android.
  Jangan diubah setelah aplikasi mulai dipakai tanpa rencana migrasi.
- Workflow ini mengasumsikan file utama aplikasi bernama `index.html` di root.
  Jika file utama atau struktur aset UsahaKu berbeda, sesuaikan sebelum build.
- Periksa isi `prepare-web.mjs` jika repository memiliki folder/file khusus yang
  tidak boleh disalin ke paket web. File `.env` sengaja dikecualikan.
