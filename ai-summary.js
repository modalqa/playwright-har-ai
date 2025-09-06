// ai-summary.js
require('dotenv/config');
const fs = require("fs");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function main() {
  const anomalies = JSON.parse(fs.readFileSync("./results/anomalies.json", "utf-8"));

  const prompt = `
Generate a detailed HAR analysis report in the following format:

📊 Laporan Hasil Analisis HAR

Total permintaan yang dianalisis: [X] anomali ditemukan.

[For each anomaly, format like this:]
[Number]. URL: [URL]
   - Status: [Status Code if error]
   - [Any performance issues with times]
   - [Any size issues with sizes]
   - Dampak: [Impact description]
   - Rekomendasi: [Specific recommendation]

✅ Ringkasan
[Summary of issues found by category]

💡 Saran umum:
[3-4 key recommendations]

Here are the anomalies to analyze:
${JSON.stringify(anomalies, null, 2)}

Please generate a report in Bahasa Indonesia following this format exactly.
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemma-3n-e2b-it:free",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const aiText = data.choices[0].message.content;

  fs.writeFileSync("./results/ai_report.txt", aiText);
  console.log("AI Report generated!");
}

main().catch(console.error);
