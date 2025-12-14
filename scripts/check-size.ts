/**
 * Bundle Size Check Script
 *
 * Fails if cn is not smaller than clsx/lite.
 * cn must be strictly better than clsx/lite in bundle size.
 */

import { existsSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const CN_DIST_FILE = "dist/index.js";
const CLSX_LITE_FILE = require.resolve("clsx/lite");

function checkSize() {
  console.log("📦 Bundle Size Check: cn vs clsx/lite\n");
  console.log("=".repeat(60));

  if (!existsSync(CN_DIST_FILE)) {
    console.error(
      `\n❌ Error: ${CN_DIST_FILE} not found. Run 'bun run build' first.\n`
    );
    process.exit(1);
  }

  if (!existsSync(CLSX_LITE_FILE)) {
    console.error(
      `\n❌ Error: ${CLSX_LITE_FILE} not found. Run 'bun install' first.\n`
    );
    process.exit(1);
  }

  // Read cn bundle
  const cnContent = readFileSync(CN_DIST_FILE);
  const cnRawSize = cnContent.length;
  const cnGzipSize = gzipSync(cnContent).length;

  // Read clsx/lite bundle
  const clsxContent = readFileSync(CLSX_LITE_FILE);
  const clsxRawSize = clsxContent.length;
  const clsxGzipSize = gzipSync(clsxContent).length;

  console.log("\n📊 Size Comparison:\n");
  console.log(
    `${"Library".padEnd(15)} | ${"Raw (bytes)".padStart(
      12
    )} | ${"Gzip (bytes)".padStart(12)}`
  );
  console.log("-".repeat(45));
  console.log(
    `${"cn".padEnd(15)} | ${String(cnRawSize).padStart(12)} | ${String(
      cnGzipSize
    ).padStart(12)}`
  );
  console.log(
    `${"clsx/lite".padEnd(15)} | ${String(clsxRawSize).padStart(12)} | ${String(
      clsxGzipSize
    ).padStart(12)}`
  );

  const rawDiff = cnRawSize - clsxRawSize;
  const gzipDiff = cnGzipSize - clsxGzipSize;

  console.log("-".repeat(45));
  console.log(
    `${"Difference".padEnd(15)} | ${
      (rawDiff > 0 ? "+" : "") + String(rawDiff).padStart(rawDiff > 0 ? 11 : 12)
    } | ${
      (gzipDiff > 0 ? "+" : "") +
      String(gzipDiff).padStart(gzipDiff > 0 ? 11 : 12)
    }`
  );

  console.log("\n" + "=".repeat(60));

  let passed = true;

  // cn must be STRICTLY smaller than clsx/lite
  if (cnRawSize >= clsxRawSize) {
    console.log(
      `\n❌ Raw size: cn (${cnRawSize}) must be smaller than clsx/lite (${clsxRawSize})`
    );
    passed = false;
  } else {
    console.log(
      `\n✅ Raw size: cn (${cnRawSize}) < clsx/lite (${clsxRawSize}) - ${Math.abs(
        rawDiff
      )} bytes smaller`
    );
  }

  if (cnGzipSize >= clsxGzipSize) {
    console.log(
      `❌ Gzip size: cn (${cnGzipSize}) must be smaller than clsx/lite (${clsxGzipSize})`
    );
    passed = false;
  } else {
    console.log(
      `✅ Gzip size: cn (${cnGzipSize}) < clsx/lite (${clsxGzipSize}) - ${Math.abs(
        gzipDiff
      )} bytes smaller`
    );
  }

  console.log();

  if (passed) {
    console.log("✅ Bundle size check passed! cn is smaller than clsx/lite.\n");
    process.exit(0);
  } else {
    console.log(
      "❌ Bundle size check failed! cn must be smaller than clsx/lite.\n"
    );
    process.exit(1);
  }
}

checkSize();
