# UsahaKu

Aplikasi pencatatan usaha untuk barang apa pun: penjualan per produk, modal per bahan dan per produk, dan pembayaran per periode (Jumat–Kamis).

## Isi folder
- index.html — halaman utama
- style.css — tampilan
- app.js — logika aplikasi
- sw.js — service worker (bisa dipakai offline)
- manifest.webmanifest — pengaturan aplikasi di layar utama HP
- icon-192.png, icon-512.png, maskable-512.png, apple-touch-icon.png, favicon-32.png — ikon

Semua file harus berada di folder yang sama.

## Cara pasang di GitHub Pages
1. Upload semua file di atas ke repository.
2. Buka Settings → Pages, pilih branch utama.
3. Buka alamat yang diberikan, lalu pilih "Tambahkan ke layar utama".

## Memperbarui aplikasi
Setiap kali mengubah file, naikkan angka di baris pertama sw.js (sekarang `usaha-fatur-v17`) agar perangkat memuat versi baru.

## Profil
- Foto profil: ketuk foto di pojok kiri atas atau di menu Pribadi.
- Nama: ketuk nama di pojok kiri atas, atau di menu Pribadi → Ubah nama.

## Produk
- Buat produk di menu Pribadi → Produk. Setiap produk punya nama, harga, dan satuan sendiri.
- Produk yang sudah punya catatan tidak bisa dihapus, hanya dinonaktifkan.

## Bahan modal
- Ketik nama bahan saat mencatat pembelian. Nama itu otomatis tersimpan dan muncul lagi saat mengetik berikutnya.
- Bahan juga bisa ditambah atau dihapus di menu Pribadi → Daftar bahan modal.

## Data
- Data disimpan di browser perangkat ini. Data tidak ikut pindah ke perangkat lain.
- Gunakan menu Pribadi → Backup secara berkala. Pulihkan dengan Pribadi → Pulihkan.
- Data dari versi lama otomatis dipindah saat pertama kali dibuka. Produk lama bernama "Produk Pertama" dan bisa diganti namanya di menu Produk.

## Aturan perhitungan
- Periode: Jumat sampai Kamis. Pembayaran jatuh tempo hari Jumat berikutnya.
- Tanda "diterima" hanya bisa dipasang setelah periode selesai.
- Harga produk dicatat per transaksi. Mengubah harga hanya berlaku untuk catatan baru.
- Bagian toko dihitung dari omzet kotor. Periode yang sudah diterima menyimpan angkanya sendiri.

## Menu (ikon garis tiga di kanan atas)
- Pelanggan & piutang: catat pelanggan, pilih pelanggan saat mencatat penjualan, catat pembayaran, dan kirim tagihan lewat WhatsApp.
- Kirim laporan WhatsApp: buat ringkasan periode, edit teksnya, lalu kirim atau salin.
- Perbandingan periode: bandingkan dua periode untuk antar, kembali, omzet, hasil, modal, dan surplus, lengkap dengan selisih per produk.

## Tema
Ketuk garis tiga di kanan atas, lalu pilih "Mode gelap / terang". Pilihan tersimpan di perangkat ini.
