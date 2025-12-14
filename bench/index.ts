import { bench, group, run } from "mitata";
import { cn } from "../src/index";
import { clsx } from "clsx/lite";

// Test data
const string1 = "foo";
const strings2 = ["foo", "bar"];
const strings3 = ["foo", "bar", "baz"];
const strings5 = [
  "text-base",
  "font-medium",
  "text-gray-900",
  "hover:text-blue-500",
  "transition-colors",
];
const strings10 = [
  "flex",
  "items-center",
  "justify-between",
  "p-4",
  "bg-white",
  "rounded-lg",
  "shadow-md",
  "hover:shadow-lg",
  "transition-all",
  "duration-200",
];

// With falsy values (common React pattern)
const withFalsy3 = ["foo", false, "bar"] as const;
const withFalsy5 = ["base", false, "active", null, "primary"] as const;
const withFalsy10 = [
  "flex",
  false,
  "items-center",
  null,
  "p-4",
  undefined,
  "bg-white",
  "",
  "rounded",
  0,
] as const;

// Conditional patterns (simulating React component usage)
const isActive = true;
const isDisabled = false;
const variant = "primary";

console.log("\n📊 @lightsound/cn vs clsx/lite Benchmark\n");
console.log("=".repeat(60));

// JIT warm-up: Pre-call functions to stabilize JIT compilation
console.log("\n🔥 JIT warm-up...");
for (let i = 0; i < 1000; i++) {
  cn();
  clsx();
  cn(string1);
  clsx(string1);
  cn(...strings10);
  clsx(...strings10);
  cn(...withFalsy10);
  clsx(...withFalsy10);
}
console.log("   Done!\n");

// Verify correctness first
console.log("\n✅ Correctness verification:");
console.log(`  cn:         "${cn(...strings3)}"`);
console.log(`  clsx/lite:  "${clsx(...strings3)}"`);
console.log();

group("No arguments", () => {
  bench("@lightsound/cn", () => cn());
  bench("clsx/lite", () => clsx());
});

group("Single string (1 arg)", () => {
  bench("@lightsound/cn", () => cn(string1));
  bench("clsx/lite", () => clsx(string1));
});

group("Simple strings (2 args)", () => {
  bench("@lightsound/cn", () => cn(...strings2));
  bench("clsx/lite", () => clsx(...strings2));
});

group("Simple strings (3 args)", () => {
  bench("@lightsound/cn", () => cn(...strings3));
  bench("clsx/lite", () => clsx(...strings3));
});

group("Simple strings (5 args)", () => {
  bench("@lightsound/cn", () => cn(...strings5));
  bench("clsx/lite", () => clsx(...strings5));
});

group("Simple strings (10 args)", () => {
  bench("@lightsound/cn", () => cn(...strings10));
  bench("clsx/lite", () => clsx(...strings10));
});

group("With falsy values (3 args)", () => {
  bench("@lightsound/cn", () => cn(...withFalsy3));
  bench("clsx/lite", () => clsx(...withFalsy3));
});

group("With falsy values (5 args)", () => {
  bench("@lightsound/cn", () => cn(...withFalsy5));
  bench("clsx/lite", () => clsx(...withFalsy5));
});

group("With falsy values (10 args)", () => {
  bench("@lightsound/cn", () => cn(...withFalsy10));
  bench("clsx/lite", () => clsx(...withFalsy10));
});

group("Conditional pattern (React-like)", () => {
  bench("@lightsound/cn", () =>
    cn(
      "btn",
      isActive && "btn-active",
      isDisabled && "btn-disabled",
      variant === "primary" && "btn-primary"
    )
  );
  bench("clsx/lite", () =>
    clsx(
      "btn",
      isActive && "btn-active",
      isDisabled && "btn-disabled",
      variant === "primary" && "btn-primary"
    )
  );
});

group("Real-world Tailwind pattern", () => {
  bench("@lightsound/cn", () =>
    cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium",
      "ring-offset-background transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      isDisabled && "pointer-events-none opacity-50",
      isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
    )
  );
  bench("clsx/lite", () =>
    clsx(
      "inline-flex items-center justify-center rounded-md text-sm font-medium",
      "ring-offset-background transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      isDisabled && "pointer-events-none opacity-50",
      isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
    )
  );
});

await run();
