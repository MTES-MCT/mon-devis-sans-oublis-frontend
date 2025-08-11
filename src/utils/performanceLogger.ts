export class PerformanceLogger {
  private timers: Map<string, number> = new Map();
  private metrics: Map<string, number[]> = new Map();

  start(label: string) {
    this.timers.set(label, performance.now());
    console.log(`[PERF-START] ${label}`);
  }

  end(label: string, metadata?: Record<string, unknown>) {
    const startTime = this.timers.get(label);
    if (!startTime) {
      console.warn(`[PERF-WARN] Timer "${label}" not found`);
      return;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(label);

    // Stocker pour les stats
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)?.push(duration);

    // Log avec metadata
    console.log(
      `[PERF-END] ${label}: ${duration.toFixed(2)}ms`,
      metadata ? metadata : ""
    );

    return duration;
  }

  getStats(label: string) {
    const values = this.metrics.get(label);
    if (!values || values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    return {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
    };
  }

  printSummary() {
    console.log("========== PERFORMANCE SUMMARY ==========");
    this.metrics.forEach((values, label) => {
      const stats = this.getStats(label);
      if (stats) {
        console.log(`${label}:`, {
          ...stats,
          min: `${stats.min.toFixed(2)}ms`,
          max: `${stats.max.toFixed(2)}ms`,
          avg: `${stats.avg.toFixed(2)}ms`,
          median: `${stats.median.toFixed(2)}ms`,
          p95: `${stats.p95.toFixed(2)}ms`,
        });
      }
    });
    console.log("=========================================");
  }
}

// Singleton
export const perfLogger = new PerformanceLogger();
