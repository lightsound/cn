/**
 * Update README with latest benchmark results
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { cn } from "../src/index";
import { clsx } from "clsx/lite";
import { scenarios } from "../bench/scenarios";

const README_PATH = "README.md";
const CN_DIST_FILE = "dist/index.js";
const CLSX_LITE_FILE = "node_modules/clsx/dist/lite.mjs";

const BENCHMARK_ITERATIONS = 100000;
const WARMUP_ITERATIONS = 10000;
const BENCHMARK_RUNS = 10; // reduce noise; align with CI benchmark philosophy

type BenchRow = {
  name: string;
  cnNs: number;
  clsxNs: number;
  improvement: number;
};

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

function runBenchmarks(): BenchRow[] {
  // Warmup
  for (const scenario of scenarios) {
    for (let i = 0; i < WARMUP_ITERATIONS; i++) {
      cn(...(scenario.args as string[]));
      clsx(...(scenario.args as string[]));
    }
  }

  const results: BenchRow[] = [];

  for (const scenario of scenarios) {
    const args = scenario.args as string[];
    const cnTimes: number[] = [];
    const clsxTimes: number[] = [];

    for (let run = 0; run < BENCHMARK_RUNS; run++) {
      cnTimes.push(measure(() => cn(...args), BENCHMARK_ITERATIONS));
      clsxTimes.push(measure(() => clsx(...args), BENCHMARK_ITERATIONS));
    }

    const avgCnTime = cnTimes.reduce((s, v) => s + v, 0) / BENCHMARK_RUNS;
    const avgClsxTime = clsxTimes.reduce((s, v) => s + v, 0) / BENCHMARK_RUNS;

    const cnNs = (avgCnTime / BENCHMARK_ITERATIONS) * 1_000_000;
    const clsxNs = (avgClsxTime / BENCHMARK_ITERATIONS) * 1_000_000;
    const improvement = Math.round((1 - cnNs / clsxNs) * 100);

    results.push({
      name: scenario.name,
      cnNs,
      clsxNs,
      improvement,
    });
  }

  return results;
}

function readBenchJson(path: string): BenchRow[] {
  const parsed = JSON.parse(readFileSync(path, "utf-8")) as {
    scenarios?: BenchRow[];
  };
  if (!parsed.scenarios || !Array.isArray(parsed.scenarios)) {
    throw new Error(`Invalid bench JSON: missing "scenarios" array in ${path}`);
  }
  return parsed.scenarios;
}

function getBundleSizes(): {
  cnRaw: number;
  cnGzip: number;
  clsxRaw: number;
  clsxGzip: number;
} {
  const cnContent = readFileSync(CN_DIST_FILE);
  const clsxContent = readFileSync(CLSX_LITE_FILE);

  return {
    cnRaw: cnContent.length,
    cnGzip: gzipSync(cnContent).length,
    clsxRaw: clsxContent.length,
    clsxGzip: gzipSync(clsxContent).length,
  };
}

function generateBenchmarkTable(results: BenchRow[]): string {
  const lines = [
    "| Test Case | @lightsound/cn | clsx/lite | Improvement |",
    "| --------- | -------------- | --------- | ----------- |",
  ];

  for (const r of results) {
    const label =
      r.improvement > 0
        ? `**${r.improvement}% faster**`
        : r.improvement < 0
        ? `**${Math.abs(r.improvement)}% slower**`
        : `**0% (tie)**`;
    lines.push(
      `| ${r.name} | ${r.cnNs.toFixed(2)} ns | ${r.clsxNs.toFixed(
        2
      )} ns | ${label} |`
    );
  }

  return lines.join("\n");
}

function updateReadme() {
  const benchJsonPath = getArgValue("--bench");
  if (benchJsonPath && existsSync(benchJsonPath)) {
    console.log(`📊 Loading benchmark results from ${benchJsonPath}...\n`);
  } else {
    console.log("📊 Running benchmarks...\n");
  }

  if (!existsSync(CN_DIST_FILE)) {
    console.error(
      `Error: ${CN_DIST_FILE} not found. Run 'bun run build' first.`
    );
    process.exit(1);
  }

  const benchResults =
    benchJsonPath && existsSync(benchJsonPath)
      ? readBenchJson(benchJsonPath)
      : runBenchmarks();
  const sizes = getBundleSizes();

  console.log("Benchmark results:");
  for (const r of benchResults) {
    const label =
      r.improvement > 0
        ? `${r.improvement}% faster`
        : r.improvement < 0
        ? `${Math.abs(r.improvement)}% slower`
        : "0% (tie)";
    console.log(`  ${r.name}: ${label}`);
  }
  console.log(`\nBundle sizes:`);
  console.log(`  cn: ${sizes.cnGzip}B gzip`);
  console.log(`  clsx/lite: ${sizes.clsxGzip}B gzip`);

  // Read README
  let readme = readFileSync(README_PATH, "utf-8");

  // Update benchmark table
  const benchmarkTable = generateBenchmarkTable(benchResults);
  const benchmarkRegex =
    /<!-- BENCHMARK_START -->[\s\S]*?<!-- BENCHMARK_END -->/;
  const benchmarkReplacement = `<!-- BENCHMARK_START -->\n${benchmarkTable}\n<!-- BENCHMARK_END -->`;

  if (benchmarkRegex.test(readme)) {
    readme = readme.replace(benchmarkRegex, benchmarkReplacement);
  } else {
    console.warn("Warning: BENCHMARK markers not found in README");
  }

  // Update size badges and mentions
  const maxImprovement = Math.max(0, ...benchResults.map((r) => r.improvement));

  // Update "Up to X% faster" in Features
  readme = readme.replace(
    /Up to \d+% faster than `clsx\/lite`/,
    `Up to ${maxImprovement}% faster than \`clsx/lite\``
  );

  // Update gzip size badge
  readme = readme.replace(
    /gzip-\d+B-brightgreen/,
    `gzip-${sizes.cnGzip}B-brightgreen`
  );

  // Update "~XXB gzipped" in Features
  readme = readme.replace(
    /\*\*Tiny\*\*: ~\d+B gzipped/,
    `**Tiny**: ~${sizes.cnGzip}B gzipped`
  );

  // Update size comparison table
  readme = readme.replace(
    /\| Size \(gzip\)\s*\|\s*~\d+B\s*\|\s*~\d+B\s*\|/,
    `| Size (gzip)     | ~${sizes.cnGzip}B          | ~${sizes.clsxGzip}B     |`
  );

  writeFileSync(README_PATH, readme);
  console.log("\n✅ README.md updated!");
}

updateReadme();
