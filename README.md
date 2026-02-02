# Ramawan App - Dokumentasi Lengkap

## 📋 Deskripsi Proyek
Ramawan App adalah aplikasi web untuk mengelola dan memantau kegiatan selama bulan Ramadan.

## 🏗️ Struktur Program

```
ramawan app/
├── index.html              # Halaman utama
├── css/
│   ├── style.css          # Stylesheet utama
│   └── responsive.css     # Responsive design
├── js/
│   ├── app.js             # Logic aplikasi utama
│   ├── prayer-times.js    # Perhitungan waktu sholat
│   └── utils.js           # Fungsi helper
├── assets/
│   ├── images/            # Gambar dan icon
│   └── fonts/             # Custom fonts
├── data/
│   └── config.json        # Konfigurasi aplikasi
└── README.md              # Dokumentasi ini
```

## 📚 Library & Dependencies

### 1. **Library JavaScript yang Direkomendasikan**

#### A. Waktu Sholat
- **Adhan.js** - Library untuk menghitung waktu sholat
  ```html
  <script src="https://cdn.jsdelivr.net/npm/adhan@4.4.3/Adhan.min.js"></script>
  ```

#### B. Tanggal Hijriyah
- **Hijri Date** - Konversi tanggal Hijriyah
  ```html
  <script src="https://cdn.jsdelivr.net/npm/hijri-date@1.0.0/hijri-date.min.js"></script>
  ```
  
  Atau gunakan **Moment Hijri**:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/moment-hijri@2.1.2/moment-hijri.min.js"></script>
  ```

#### C. Notifikasi
- **Push.js** - Notifikasi browser
  ```html
  <script src="https://cdn.jsdelivr.net/npm/push.js@1.0.12/bin/push.min.js"></script>
  ```

#### D. Charts & Visualisasi (Opsional)
- **Chart.js** - Untuk statistik ibadah
  ```html
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  ```

#### E. Icons
- **Font Awesome** - Icon library
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  ```

#### F. Animasi (Opsional)
- **AOS (Animate On Scroll)**
  ```html
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  ```

### 2. **CSS Framework (Pilih Salah Satu)**

#### Option A: Vanilla CSS (Direkomendasikan untuk kontrol penuh)
- Tidak perlu instalasi tambahan
- Kontrol penuh atas styling

#### Option B: Bootstrap 5
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
```

#### Option C: Tailwind CSS
```html
<script src="https://cdn.tailwindcss.com"></script>
```

### 3. **Google Fonts**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
```

## 🔧 Aplikasi Pendukung yang Dibutuhkan

### 1. **Code Editor**
- **Visual Studio Code** (Direkomendasikan)
  - Download: https://code.visualstudio.com/
  - Extensions yang berguna:
    - Live Server
    - Prettier - Code formatter
    - Auto Rename Tag
    - HTML CSS Support
    - JavaScript (ES6) code snippets

### 2. **Web Browser untuk Testing**
- **Google Chrome** (dengan DevTools)
- **Firefox Developer Edition**
- **Microsoft Edge**

### 3. **Version Control (Opsional)**
- **Git**
  - Download: https://git-scm.com/
  - Untuk backup dan version control

### 4. **Local Server (Pilih Salah Satu)**
- **Live Server** (VS Code Extension) - Paling mudah
- **Python HTTP Server** (jika sudah ada Python):
  ```bash
  python -m http.server 8000
  ```
- **Node.js http-server**:
  ```bash
  npm install -g http-server
  http-server
  ```

### 5. **Image Optimization (Opsional)**
- **TinyPNG** - https://tinypng.com/
- **ImageOptim** (untuk optimasi gambar)

## 📦 Instalasi & Setup

### Langkah 1: Persiapan Folder
Struktur folder sudah ada di `c:\Users\9C\Documents\ramawan app\`

### Langkah 2: Install VS Code Extensions
1. Buka VS Code
2. Tekan `Ctrl+Shift+X`
3. Cari dan install:
   - Live Server
   - Prettier

### Langkah 3: Tidak Perlu NPM/Node.js (Untuk Versi Sederhana)
Jika menggunakan CDN untuk semua library, Anda tidak perlu install Node.js atau NPM.

### Langkah 4: Jalankan Aplikasi
1. Buka folder di VS Code
2. Klik kanan pada `index.html`
3. Pilih "Open with Live Server"
4. Browser akan otomatis terbuka

## 🎯 Fitur yang Akan Dibangun

1. **Dashboard Ramadan**
   - Countdown ke Ramadan
   - Hari ke-berapa Ramadan
   - Tanggal Hijriyah

2. **Jadwal Sholat**
   - Waktu sholat 5 waktu
   - Notifikasi adzan
   - Deteksi lokasi otomatis

3. **Tracker Ibadah**
   - Checklist sholat
   - Tadarus Al-Quran
   - Sedekah tracker

4. **Kalender Ramadan**
   - Jadwal imsakiyah
   - Catatan harian

5. **Doa & Dzikir**
   - Kumpulan doa Ramadan
   - Counter dzikir digital

## 🚀 Quick Start

Untuk memulai dengan cepat, semua dependencies akan menggunakan CDN (Content Delivery Network), sehingga tidak perlu instalasi lokal. Cukup koneksi internet saat development.

## 📝 Catatan Penting

- **Tidak perlu install Node.js** jika menggunakan CDN
- **Tidak perlu package.json** untuk versi sederhana
- **Live Server** di VS Code sudah cukup untuk development
- Semua library akan di-load dari CDN untuk kemudahan

## 🔗 Resources & API

### API Waktu Sholat (Gratis)
1. **Aladhan API**: https://aladhan.com/prayer-times-api
2. **Islamic Network**: https://api.aladhan.com/v1/timingsByCity

### Contoh Request:
```javascript
// Mendapatkan waktu sholat berdasarkan kota
fetch('https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=2')
  .then(response => response.json())
  .then(data => console.log(data.data.timings));
```

## 📱 Progressive Web App (PWA) - Opsional

Untuk membuat aplikasi bisa diinstall di mobile:
1. Tambahkan `manifest.json`
2. Tambahkan Service Worker
3. Tambahkan icons

## 🎨 Design Inspiration

- Gunakan warna Islamic: Hijau, Gold, Putih
- Dark mode untuk nyaman di malam hari
- Animasi smooth dan modern
- Responsive untuk mobile dan desktop

---

**Dibuat untuk**: Ramawan App
**Versi**: 1.0.0
**Tanggal**: 2 Februari 2026
