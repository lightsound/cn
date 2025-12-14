/**
 * CI Benchmark Script
 *
 * Compares @lightsound/cn against clsx/lite and fails if cn is not faster.
 * cn must be strictly better than clsx/lite in performance.
 * cn must be faster in ALL scenarios, not just overall.
 *
 * Runs multiple iterations to reduce noise and uses average for judgment.
 */

import { cn } from "../src/index";
import { clsx } from "clsx/lite";
import { scenarios } from "./scenarios";

const WARMUP_ITERATIONS = 10000;
const BENCHMARK_ITERATIONS = 100000;
const BENCHMARK_RUNS = 5; // Run each scenario multiple times

function measure(fn: () => void, iterations: number): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  return end - start;
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
    avgCnTime: number;
    avgClsxTime: number;
    avgRatio: number;
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

    const avgCnTime = runs.reduce((sum, r) => sum + r.cnTime, 0) / BENCHMARK_RUNS;
    const avgClsxTime = runs.reduce((sum, r) => sum + r.clsxTime, 0) / BENCHMARK_RUNS;
    const avgRatio = avgCnTime / avgClsxTime;
    // cn must be faster on average (ratio < 1.0)
    const passed = avgRatio < 1.0;

    results.push({
      name: scenario.name,
      avgCnTime,
      avgClsxTime,
      avgRatio,
      passed,
      runs,
    });
  }

  // Print results
  console.log("📊 Results (average of 5 runs):\n");
  console.log(
    `${"Scenario".padEnd(25)} | ${"cn (ms)".padStart(
      10
    )} | ${"clsx (ms)".padStart(10)} | ${"Avg Ratio".padStart(10)} | Status`
  );
  console.log("-".repeat(80));

  for (const result of results) {
    const status = result.passed ? "✅ PASS" : "❌ FAIL";
    const ratioStr = result.avgRatio.toFixed(2) + "x";
    console.log(
      `${result.name.padEnd(25)} | ${result.avgCnTime
        .toFixed(2)
        .padStart(10)} | ${result.avgClsxTime
        .toFixed(2)
        .padStart(10)} | ${ratioStr.padStart(10)} | ${status}`
    );
  }

  console.log("\n" + "=".repeat(60));

  // Check if ALL scenarios passed (cn must be faster in EVERY scenario)
  const failedScenarios = results.filter((r) => !r.passed);
  const allPassed = failedScenarios.length === 0;

  if (allPassed) {
    // Calculate overall speedup for display
    const totalCn = results.reduce((sum, r) => sum + r.avgCnTime, 0);
    const totalClsx = results.reduce((sum, r) => sum + r.avgClsxTime, 0);
    const overallRatio = totalCn / totalClsx;
    const speedup = ((1 - overallRatio) * 100).toFixed(0);
    console.log(
      `\n✅ All ${results.length} scenarios passed! cn is ${speedup}% faster than clsx/lite overall.\n`
    );
    process.exit(0);
  } else {
    console.log(
      `\n❌ Benchmark failed! cn must be faster than clsx/lite in ALL scenarios.`
    );
    console.log(
      `   Failed scenarios: ${failedScenarios.length}/${results.length}`
    );
    for (const f of failedScenarios) {
      console.log(`   - ${f.name}: ${f.avgRatio.toFixed(2)}x (must be < 1.0)`);
    }
    console.log();
    process.exit(1);
  }
}

runBenchmark();
