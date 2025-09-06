const fs = require("fs");

const har = JSON.parse(fs.readFileSync("./results/test.har", "utf-8"));
const anomalies = [];

// Statistics counters
let errorCount = 0;
let slowResponseCount = 0;
let largeSizeCount = 0;

for (const entry of har.log.entries) {
  const { status } = entry.response;
  const time = entry.time;
  const size = entry.response.content.size || 0;
  const sizeInMB = size / (1024 * 1024);

  if (status >= 400 || time > 2000 || size > 1_000_000) {
    const anomaly = {
      url: entry.request.url,
      status,
      time,
      size: sizeInMB.toFixed(2) + " MB",
      issues: []
    };

    // Classify issues
    if (status >= 400) {
      errorCount++;
      anomaly.issues.push({
        type: "error",
        description: `Status ${status} (${getStatusText(status)})`,
        impact: getErrorImpact(status),
        recommendation: getErrorRecommendation(status)
      });
    }

    if (time > 2000) {
      slowResponseCount++;
      anomaly.issues.push({
        type: "performance",
        description: `Response time: ${time.toFixed(0)} ms (exceeds 2000 ms threshold)`,
        impact: "Slow page load times affecting user experience",
        recommendation: "Investigate backend performance, consider caching or optimization"
      });
    }

    if (size > 1_000_000) {
      largeSizeCount++;
      anomaly.issues.push({
        type: "size",
        description: `Payload size: ${sizeInMB.toFixed(2)} MB (exceeds 1 MB threshold)`,
        impact: "Large payload may cause slow loading on mobile networks",
        recommendation: "Consider implementing pagination, compression, or lazy loading"
      });
    }

    anomalies.push(anomaly);
  }
}

// Add summary statistics
const summary = {
  totalAnomalies: anomalies.length,
  errorCount,
  slowResponseCount,
  largeSizeCount,
  anomalies
};

fs.writeFileSync("./results/anomalies.json", JSON.stringify(summary, null, 2));
console.log(`Analysis complete:
- Total anomalies: ${anomalies.length}
- HTTP errors: ${errorCount}
- Slow responses: ${slowResponseCount}
- Large payloads: ${largeSizeCount}`);

// Helper functions
function getStatusText(status) {
  const statusTexts = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout"
  };
  return statusTexts[status] || "Unknown Error";
}

function getErrorImpact(status) {
  if (status === 404) return "Missing resource affecting functionality";
  if (status === 401 || status === 403) return "Authentication/Authorization issues";
  if (status >= 500) return "Server-side issues affecting service availability";
  return "Request failed, potentially affecting user experience";
}

function getErrorRecommendation(status) {
  if (status === 404) return "Ensure resource exists or update/remove references";
  if (status === 401 || status === 403) return "Verify authentication credentials and permissions";
  if (status >= 500) return "Investigate server logs and backend services";
  return "Review request parameters and server configuration";
}
