import { bench, group, run } from "mitata";
import { cn } from "../src/index";
import { clsx } from "clsx/lite";

// 引数数別のテストデータ
const args1 = ["a"];
const args2 = ["a", "b"];
const args3 = ["a", "b", "c"];
const args5 = ["a", "b", "c", "d", "e"];
const args10 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
const args20 = Array(20)
  .fill(0)
  .map((_, i) => `class-${i}`);
const args50 = Array(50)
  .fill(0)
  .map((_, i) => `class-${i}`);

// With falsy values scaling
const argsWithFalsy10 = [
  "a",
  false,
  "b",
  null,
  "c",
  undefined,
  "d",
  "",
  "e",
  0,
] as const;
const argsWithFalsy20 = Array(20)
  .fill(0)
  .map((_, i) => (i % 2 === 0 ? `class-${i}` : false));
const argsWithFalsy50 = Array(50)
  .fill(0)
  .map((_, i) => (i % 2 === 0 ? `class-${i}` : null));

console.log(
  "\n📈 Scaling Benchmark: How performance changes with argument count\n"
);
console.log("=".repeat(60));

// JIT warm-up: Pre-call functions to stabilize JIT compilation
console.log("\n🔥 JIT warm-up...");
for (let i = 0; i < 1000; i++) {
  cn(...args50);
  clsx(...args50);
  cn(...argsWithFalsy50);
  clsx(...(argsWithFalsy50 as string[]));
}
console.log("   Done!\n");

group("1 argument", () => {
  bench("@lightsound/cn", () => cn(...args1));
  bench("clsx/lite", () => clsx(...args1));
});

group("2 arguments", () => {
  bench("@lightsound/cn", () => cn(...args2));
  bench("clsx/lite", () => clsx(...args2));
});

group("3 arguments", () => {
  bench("@lightsound/cn", () => cn(...args3));
  bench("clsx/lite", () => clsx(...args3));
});

group("5 arguments", () => {
  bench("@lightsound/cn", () => cn(...args5));
  bench("clsx/lite", () => clsx(...args5));
});

group("10 arguments", () => {
  bench("@lightsound/cn", () => cn(...args10));
  bench("clsx/lite", () => clsx(...args10));
});

group("20 arguments", () => {
  bench("@lightsound/cn", () => cn(...args20));
  bench("clsx/lite", () => clsx(...args20));
});

group("50 arguments", () => {
  bench("@lightsound/cn", () => cn(...args50));
  bench("clsx/lite", () => clsx(...args50));
});

// Falsy values scaling tests
group("10 arguments (with falsy)", () => {
  bench("@lightsound/cn", () => cn(...argsWithFalsy10));
  bench("clsx/lite", () => clsx(...(argsWithFalsy10 as unknown as string[])));
});

group("20 arguments (with falsy)", () => {
  bench("@lightsound/cn", () => cn(...argsWithFalsy20));
  bench("clsx/lite", () => clsx(...(argsWithFalsy20 as string[])));
});

group("50 arguments (with falsy)", () => {
  bench("@lightsound/cn", () => cn(...argsWithFalsy50));
  bench("clsx/lite", () => clsx(...(argsWithFalsy50 as string[])));
});

await run();

console.log("\n📊 Summary: Performance scaling analysis");
console.log("cn uses a single-loop approach that processes all arguments");
console.log("in one pass, building the result string efficiently.\n");
