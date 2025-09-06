# Playwright HAR Analysis with AI

Tool untuk menganalisis file HAR (HTTP Archive) dari tes Playwright dan menghasilkan laporan analisis menggunakan AI.

## 🚀 Fitur

- Capture HAR file dari tes Playwright
- Analisis otomatis untuk:
  - Error status code (4xx, 5xx)
  - Response time yang lambat
  - Payload size yang besar
- Laporan AI yang detail dalam Bahasa Indonesia
- Rekomendasi teknis untuk perbaikan

## 📋 Prasyarat

- Node.js v16 atau lebih baru
- NPM
- Playwright Test
- OpenRouter API Key untuk fitur AI

## ⚙️ Instalasi

1. Clone repository:
```bash
git clone git@github.com:modalqa/playwright-har-ai.git
cd playwright-har-ai
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variable:
```bash
# Buat file .env
OPENROUTER_API_KEY=your_api_key_here
```

## 🎯 Penggunaan

1. Jalankan test untuk menghasilkan HAR file:
```bash
npm run test:ui
```
File HAR akan disimpan di folder `results/test.har`

2. Analisis HAR file:
```bash
npm run analyze
```
Hasil analisis akan disimpan di `results/anomalies.json`

3. Generate laporan AI:
```bash
npm run ai
```
Laporan akan disimpan di `results/ai_report.txt`

## 📊 Format Laporan

Laporan AI akan mencakup:
- Total anomali yang ditemukan
- Detail setiap masalah:
  - URL yang bermasalah
  - Status code (jika error)
  - Response time
  - Payload size
  - Dampak
  - Rekomendasi
- Ringkasan masalah
- Saran umum untuk perbaikan

## ⚙️ Konfigurasi

Anda dapat mengubah threshold analisis di `analyze-har.js`:
- Response time: default 2000ms
- Payload size: default 1MB

## 📝 Contoh Output

```
📊 Laporan Hasil Analisis HAR

Total permintaan yang dianalisis: 3 anomali ditemukan.

1. URL: https://example.com/api/data
   - Status: 404 (Not Found)
   - Dampak: Resource tidak ditemukan
   - Rekomendasi: Periksa URL dan ketersediaan endpoint

...dst
```

## 🤝 Kontribusi

Kontribusi selalu welcome! Silakan buat pull request atau issue untuk perbaikan dan saran.

## 📄 Lisensi

ISC License - lihat file [LICENSE](LICENSE) untuk detail
