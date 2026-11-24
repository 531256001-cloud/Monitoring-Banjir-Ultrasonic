# HYDRO-EWS • Flood Monitoring Dashboard (Next.js 14)

Sistem Monitoring Banjir Realtime berbasis IoT Sensor Ultrasonic (ESP32) dan Firebase Realtime Database. Dibangun dengan framework **Next.js 14 (App Router)**, **TypeScript**, dan **Tailwind CSS**, merujuk pada standar desain **DESIGN.md** dan template **code.html**.

---

## 🚀 Fitur Utama

1. **Sinkronisasi Realtime Firebase RTDB**:
   - Mendengarkan endpoint `/sensor_jarak` dan `/historyDataJarak` secara realtime.
   - Dual-connection mode: **Server-Sent Events (SSE)** untuk instant live stream dan **Auto-polling fallback** (setiap 2.5 detik).
   - Timestamp Decoder otomatis dari Firebase Push ID (`-P65...`) dengan akurasi milidetik.

2. **Hero Telemetry Bento Grid**:
   - Jarak Sensor ke Muka Air (cm) dengan pembacaan metric besar.
   - Ambang Batas Siaga Banjir dinamis (Siaga 4 / Aman >200cm, Siaga 2 / Waspada 100-200cm, Siaga 1 / Bahaya <100cm, Di Luar Jangkauan >400cm).
   - TMA (Tinggi Muka Air) dari dasar sungai, estimasi debit air (m³/detik), fluktuasi 1 jam, curah hujan.
   - Diagnostik status IoT: Solar Battery (%), Signal RSSI (dBm), Latency (ms).

3. **Chart History Data Interaktif**:
   - Kurva elevasi ketinggian air interaktif berbasis SVG scalable.
   - Filter rentang waktu: 1 Jam, 6 Jam, 24 Jam, Semua Data.
   - Garis batas ambang Bahaya (100 cm) dan Waspada (200 cm).
   - Tooltip hover data point dengan informasi detail.

4. **Table History Data Telemetri**:
   - Mapping push keys Firebase (`-P65...`) secara realtime.
   - Pencarian cerdas berdasarkan Push Key, waktu, kondisi, atau jarak.
   - Filter dropdown status: Aman, Waspada, Bahaya, Di Luar Jangkauan.
   - Tombol **Ekspor CSV** data telemetri.
   - Tombol **Salin URL Firebase RTDB**.
   - Inspector Raw JSON payload Firebase.

5. **Audio Siren EWS Synthesizer**:
   - Sintesis audio sirene peringatan dini secara langsung melalui Web Audio API browser (tanpa perlu file audio eksternal).
   - Tombol broadcast alert simulasi BPBD.

---

## 🛠️ Cara Menjalankan Project Next.js

### 1. Prasyarat
Pastikan **Node.js** (versi 18.18 atau lebih baru) telah terinstal di komputer.
Jika belum terinstal, Anda dapat mengunduhnya melalui [nodejs.org](https://nodejs.org) atau melalui command line:
```bash
winget install OpenJS.NodeJS.LTS
```

### 2. Instalasi Dependensi
Buka terminal pada folder `flood-monitoring-nextjs` lalu jalankan:
```bash
cd flood-monitoring-nextjs
npm install
```

### 3. Jalankan Server Development
```bash
npm run dev
```

Buka browser Anda dan akses:
```
http://localhost:3000
```

---

## 📡 Konfigurasi Firebase RTDB

Konfigurasi telah diatur pada `lib/firebase.ts`:
```typescript
export const FIREBASE_CONFIG = {
  host: 'https://project-despro-2-default-rtdb.asia-southeast1.firebasedatabase.app/',
  auth: 'stZoWOUZBi8XcGGwSW2HfY6KYxPGWAy7iqrHHLkr',
};
```

---

## 📂 Struktur File

```
flood-monitoring-nextjs/
├── app/
│   ├── globals.css          # Styling Tailwind & Google Fonts
│   ├── layout.tsx           # Layout root Next.js
│   └── page.tsx             # Halaman utama dashboard
├── components/
│   ├── Header.tsx           # Navbar & status sirene
│   ├── HeroBento.tsx        # Hero KPI telemetri ultrasonic
│   ├── TelemetryChart.tsx   # Grafik history elevasi muka air
│   ├── TelemetryTable.tsx   # Tabel data history & ekspor CSV
│   ├── IncidentBar.tsx      # Bar pengujian sirene & protokol EWS
│   └── RawJsonModal.tsx     # Modal viewer payload mentah Firebase
├── hooks/
│   └── useFirebaseRealtime.ts # Hook reaktif koneksi Firebase RTDB
├── lib/
│   ├── audio.ts             # Web Audio API Siren Generator
│   ├── firebase.ts          # Endpoint & credential loader
│   ├── types.ts             # TypeScript interfaces
│   └── utils.ts             # Push ID decoder & status evaluator
├── tailwind.config.ts       # Definisi token desain (DESIGN.md)
└── package.json
```

