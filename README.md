# ✨ To-Do List Interaktif (Modern Glassmorphism)

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech](https://img.shields.io/badge/built%20with-HTML5%20%7C%20CSS3%20%7C%20JS-orange)

Aplikasi To-Do List berbasis web yang modern, responsif, dan interaktif. Dibangun menggunakan **Vanilla JavaScript**, proyek ini menampilkan antarmuka desain **Glassmorphism**, animasi halus, pelacakan progres, dan penyimpanan data lokal agar tugas Anda tidak hilang saat browser ditutup.

---

## 📸 Tampilan Antarmuka

![Screenshot Aplikasi](https://via.placeholder.com/800x400.png?text=Screenshot+Aplikasi+To-Do+List)

---

## 🚀 Fitur Utama

Aplikasi ini bukan sekadar daftar tugas biasa. Berikut adalah fitur unggulannya:

### 🎨 Antarmuka & UX
* **Desain Glassmorphism:** Tampilan modern dengan efek *blur* dan transparansi.
* **Background Animasi:** Mesh gradient yang bergerak lembut di latar belakang.
* **Progress Ring:** Indikator visual melingkar yang menunjukkan persentase penyelesaian tugas.
* **Efek Confetti:** Animasi perayaan saat tugas diselesaikan.
* **Toast Notifications:** Notifikasi *popup* untuk setiap aksi (tambah, edit, hapus, error).

### 🛠️ Fungsionalitas
* **Manajemen Tugas (CRUD):** Tambah, Lihat, Edit, dan Hapus tugas.
* **Kategori Tugas:** Mendukung kategori dengan ikon otomatis:
    * 💼 Pekerjaan (Business)
    * 🏠 Personal
    * 🛒 Belanja (Shopping)
    * 💪 Kesehatan (Health)
* **Sistem Filter:** Tab untuk melihat tugas "Semua", "Proses", atau "Selesai".
* **Pengurutan (Sorting):** Urutkan berdasarkan Terbaru, Prioritas Waktu (Deadline), atau Nama (A-Z).
* **Indikator Deadline:** Badge otomatis untuk tugas yang "Hari Ini" atau "Terlewat".
* **Local Storage:** Data tersimpan otomatis di browser, tugas tidak hilang saat di-refresh.

---

## 📂 Struktur Proyek

```bash
.
├── index.html      # Struktur utama aplikasi
├── style.css       # Styling, variabel warna, dan animasi CSS
├── script.js       # Logika aplikasi, manipulasi DOM, dan LocalStorage
└── README.md       # Dokumentasi proyek ini
💻 Cara Menjalankan
Anda tidak perlu menginstal dependensi apa pun (seperti Node.js atau Python) karena ini adalah aplikasi web statis murni.

Clone repositori ini (atau download ZIP):

Bash

git clone [https://github.com/username-anda/nama-repo-todo.git](https://github.com/username-anda/nama-repo-todo.git)
Buka Folder Proyek: Masuk ke direktori tempat file disimpan.

Jalankan Aplikasi: Klik dua kali file index.html untuk membukanya di browser favorit Anda (Chrome, Firefox, Edge, dll).

🔧 Teknologi yang Digunakan
HTML5: Struktur semantik.

CSS3: Custom Properties (Variables), Flexbox, CSS Grid, Keyframes Animation, Backdrop Filter.

JavaScript (ES6+): DOM Manipulation, Event Handling, LocalStorage API, Date Object.

Font Awesome: Untuk ikon antarmuka (dimuat via CDN).

Google Fonts: Menggunakan font Plus Jakarta Sans.

🤝 Kontribusi
Kontribusi selalu diterima! Jika Anda ingin meningkatkan fitur atau memperbaiki bug:

Fork repositori ini.

Buat branch fitur baru (git checkout -b fitur-keren).

Commit perubahan Anda (git commit -m 'Menambahkan fitur keren').

Push ke branch tersebut (git push origin fitur-keren).

Buat Pull Request.
