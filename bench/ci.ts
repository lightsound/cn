/**
 * CI Benchmark Script
 *
 * Compares @lightsound/cn against clsx/lite and fails if cn is not faster.
 * cn must be strictly better than clsx/lite in performance.
 * cn must be faster in ALL scenarios, not just overall.
 *
 * Runs multiple iterations to reduce noise and uses median for judgment.
 * Reports both median and mean, with standard deviation for visibility.
 */

import { cn } from "../src/index";
import { clsx } from "clsx/lite";
import { scenarios } from "./scenarios";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const WARMUP_ITERATIONS = 10000;
const BENCHMARK_ITERATIONS = 100000;
const BENCHMARK_RUNS = 30; // Run each scenario multiple times for statistical reliability
const TRIM_PERCENT = 0.1; // Trim top and bottom 10% to remove outliers

/**
 * Calculate median of an array of numbers
 */
function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Calculate standard deviation of an array of numbers
 */
function standardDeviation(values: number[]): number {
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squareDiffs = values.map((v) => Math.pow(v - avg, 2));
  const avgSquareDiff =
    squareDiffs.reduce((sum, v) => sum + v, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
}

/**
 * Trim outliers from an array (remove top and bottom percentages)
 */
function trimOutliers(values: number[], trimPercent: number): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  const trimCount = Math.floor(sorted.length * trimPercent);
  return sorted.slice(trimCount, sorted.length - trimCount);
}

function measure(fn: () => void, iterations: number): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  return end - start;
}

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

async function runBenchmark() {
  console.log("🔥 CI Benchmark: @lightsound/cn vs clsx/lite\n");
  console.log("=".repeat(60));
  console.log(`\n⚠️  cn must be FASTER than clsx/lite (avg ratio < 1.0)`);
  console.log(`📊 Running ${BENCHMARK_RUNS} iterations per scenario\n`);

  // Warmup
  console.log("⏳ Warming up JIT...");
  for (const scenario of scenarios) {
    const args = scenario.args as unknown as string[];
    for (let i = 0; i < WARMUP_ITERATIONS; i++) {
      cn(...args);
      clsx(...args);
    }
  }
  console.log("   Done!\n");

  const results: {
    name: string;
    // Median-based stats (primary)
    medianCnTime: number;
    medianClsxTime: number;
    medianRatio: number;
    // Mean-based stats (secondary)
    avgCnTime: number;
    avgClsxTime: number;
    avgRatio: number;
    // Standard deviations
    cnStdDev: number;
    clsxStdDev: number;
    // Nanoseconds per operation (based on median)
    cnNs: number;
    clsxNs: number;
    improvement: number;
    passed: boolean;
    runs: { cnTime: number; clsxTime: number; ratio: number }[];
  }[] = [];

  for (const scenario of scenarios) {
    const args = scenario.args as unknown as string[];
    const runs: { cnTime: number; clsxTime: number; ratio: number }[] = [];

    for (let run = 0; run < BENCHMARK_RUNS; run++) {
      const cnTime = measure(() => cn(...args), BENCHMARK_ITERATIONS);
      const clsxTime = measure(() => clsx(...args), BENCHMARK_ITERATIONS);
      const ratio = cnTime / clsxTime;
      runs.push({ cnTime, clsxTime, ratio });
    }

    const cnTimes = runs.map((r) => r.cnTime);
    const clsxTimes = runs.map((r) => r.clsxTime);

    // Trim outliers for more stable results
    const trimmedCnTimes = trimOutliers(cnTimes, TRIM_PERCENT);
    const trimmedClsxTimes = trimOutliers(clsxTimes, TRIM_PERCENT);

    // Calculate median (primary metric)
    const medianCnTime = median(trimmedCnTimes);
    const medianClsxTime = median(trimmedClsxTimes);
    const medianRatio = medianCnTime / medianClsxTime;

    // Calculate mean (secondary metric)
    const avgCnTime =
      trimmedCnTimes.reduce((sum, t) => sum + t, 0) / trimmedCnTimes.length;
    const avgClsxTime =
      trimmedClsxTimes.reduce((sum, t) => sum + t, 0) / trimmedClsxTimes.length;
    const avgRatio = avgCnTime / avgClsxTime;

    // Calculate standard deviations
    const cnStdDev = standardDeviation(trimmedCnTimes);
    const clsxStdDev = standardDeviation(trimmedClsxTimes);

    // Use median for ns/op and improvement calculation
    const cnNs = (medianCnTime / BENCHMARK_ITERATIONS) * 1_000_000;
    const clsxNs = (medianClsxTime / BENCHMARK_ITERATIONS) * 1_000_000;
    const improvement = Math.round((1 - cnNs / clsxNs) * 100);

    // cn must be faster based on MEDIAN (ratio < 1.0)
    const passed = medianRatio < 1.0;

    results.push({
      name: scenario.name,
      medianCnTime,
      medianClsxTime,
      medianRatio,
      avgCnTime,
      avgClsxTime,
      avgRatio,
      cnStdDev,
      clsxStdDev,
      cnNs,
      clsxNs,
      improvement,
      passed,
      runs,
    });
  }

  // Print results
  const trimmedRuns = Math.floor(BENCHMARK_RUNS * (1 - TRIM_PERCENT * 2));
  console.log(
    `📊 Results (${BENCHMARK_RUNS} runs, trimmed to ${trimmedRuns}, using median):\n`
  );
  console.log(
    `${"Scenario".padEnd(25)} | ${"cn (ms)".padStart(
      10
    )} | ${"clsx (ms)".padStart(10)} | ${"Med Ratio".padStart(
      10
    )} | ${"Avg Ratio".padStart(10)} | ${"cn σ".padStart(8)} | Status`
  );
  console.log("-".repeat(105));

  for (const result of results) {
    const status = result.passed ? "✅ PASS" : "❌ FAIL";
    const medRatioStr = result.medianRatio.toFixed(2) + "x";
    const avgRatioStr = result.avgRatio.toFixed(2) + "x";
    const stdDevStr = result.cnStdDev.toFixed(2);
    console.log(
      `${result.name.padEnd(25)} | ${result.medianCnTime
        .toFixed(2)
        .padStart(10)} | ${result.medianClsxTime
        .toFixed(2)
        .padStart(10)} | ${medRatioStr.padStart(10)} | ${avgRatioStr.padStart(
        10
      )} | ${stdDevStr.padStart(8)} | ${status}`
    );
  }

  console.log("\n" + "=".repeat(60));

  // Check if ALL scenarios passed (cn must be faster in EVERY scenario)
  const failedScenarios = results.filter((r) => !r.passed);
  const allPassed = failedScenarios.length === 0;

  const outputPath = getArgValue("--output");
  if (outputPath) {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(
      outputPath,
      JSON.stringify(
        {
          meta: {
            iterations: BENCHMARK_ITERATIONS,
            warmupIterations: WARMUP_ITERATIONS,
            runs: BENCHMARK_RUNS,
            trimPercent: TRIM_PERCENT,
            timestamp: new Date().toISOString(),
            platform: process.platform,
            arch: process.arch,
          },
          scenarios: results.map((r) => ({
            name: r.name,
            cnNs: r.cnNs,
            clsxNs: r.clsxNs,
            improvement: r.improvement,
            // Median-based (primary)
            medianRatio: r.medianRatio,
            medianCnTimeMs: r.medianCnTime,
            medianClsxTimeMs: r.medianClsxTime,
            // Mean-based (secondary)
            avgRatio: r.avgRatio,
            avgCnTimeMs: r.avgCnTime,
            avgClsxTimeMs: r.avgClsxTime,
            // Standard deviations
            cnStdDevMs: r.cnStdDev,
            clsxStdDevMs: r.clsxStdDev,
          })),
        },
        null,
        2
      )
    );
    console.log(`\n📝 Wrote benchmark JSON to ${outputPath}`);
  }

  if (allPassed) {
    // Calculate overall speedup for display (using median)
    const totalCn = results.reduce((sum, r) => sum + r.medianCnTime, 0);
    const totalClsx = results.reduce((sum, r) => sum + r.medianClsxTime, 0);
    const overallRatio = totalCn / totalClsx;
    const speedup = ((1 - overallRatio) * 100).toFixed(0);
    console.log(
      `\n✅ All ${results.length} scenarios passed! cn is ${speedup}% faster than clsx/lite overall (median-based).\n`
    );
    process.exit(0);
  } else {
    console.log(
      `\n❌ Benchmark failed! cn must be faster than clsx/lite in ALL scenarios (median-based).`
    );
    console.log(
      `   Failed scenarios: ${failedScenarios.length}/${results.length}`
    );
    for (const f of failedScenarios) {
      console.log(
        `   - ${f.name}: median ${f.medianRatio.toFixed(
          2
        )}x, avg ${f.avgRatio.toFixed(2)}x (must be < 1.0)`
      );
    }
    console.log();
    process.exit(1);
  }
}

runBenchmark();
