# @lightsound/cn

A tiny, **blazing fast** utility for constructing `className` strings conditionally.

[![npm version](https://img.shields.io/npm/v/@lightsound/cn.svg)](https://www.npmjs.com/package/@lightsound/cn)
[![CI](https://github.com/lightsound/cn/actions/workflows/ci.yml/badge.svg)](https://github.com/lightsound/cn/actions/workflows/ci.yml)
[![gzip size](https://img.shields.io/badge/gzip-130B-brightgreen.svg)](https://bundlephobia.com/package/@lightsound/cn)
[![license](https://img.shields.io/npm/l/@lightsound/cn.svg)](./LICENSE)

## Features

- **Blazing Fast**: Up to 21% faster than `clsx/lite`
- **Tiny**: ~130B gzipped (smaller than clsx/lite!)
- **TypeScript**: Full type support out of the box
- **Simple API**: Strings only - no objects, no arrays, maximum performance
- **Zero Dependencies**: No external dependencies

## Benchmarks

> Benchmarks are run on every CI build. See the [latest CI run](https://github.com/lightsound/cn/actions/workflows/ci.yml) for up-to-date results.

<!-- BENCHMARK_START -->
| Test Case | @lightsound/cn | clsx/lite | Improvement |
| --------- | -------------- | --------- | ----------- |
| 2 strings | 83.27 ns | 76.58 ns | **-9% faster** |
| 3 strings | 100.00 ns | 115.30 ns | **13% faster** |
| 5 strings | 113.06 ns | 142.27 ns | **21% faster** |
| 10 strings | 174.20 ns | 172.56 ns | **-1% faster** |
<!-- BENCHMARK_END -->

## Installation

```bash
# npm
npm install @lightsound/cn

# pnpm
pnpm add @lightsound/cn

# yarn
yarn add @lightsound/cn

# bun
bun add @lightsound/cn
```

## Usage

```typescript
import { cn } from "@lightsound/cn";
// or
import cn from "@lightsound/cn";

// Basic usage
cn("foo", "bar");
// => 'foo bar'

// Conditional classes
cn("btn", isActive && "btn-active", isDisabled && "btn-disabled");
// => 'btn btn-active' (if isActive is true, isDisabled is false)

// With ternary expressions
cn("btn", variant === "primary" ? "btn-primary" : "btn-secondary");
// => 'btn btn-primary'

// Falsy values are ignored
cn("foo", false, null, undefined, 0, "", "bar");
// => 'foo bar'
```

## Real-world Example (Tailwind CSS)

```typescript
import { cn } from "@lightsound/cn";

interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

function Button({
  variant = "primary",
  size = "md",
  disabled,
  className,
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium",
        "transition-colors focus-visible:outline-none focus-visible:ring-2",
        variant === "primary" && "bg-blue-500 text-white hover:bg-blue-600",
        variant === "secondary" &&
          "bg-gray-200 text-gray-900 hover:bg-gray-300",
        size === "sm" && "h-8 px-3 text-sm",
        size === "md" && "h-10 px-4 text-base",
        size === "lg" && "h-12 px-6 text-lg",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      disabled={disabled}
    >
      Click me
    </button>
  );
}
```

## API

### `cn(...classes)`

Combines class names into a single string. Only accepts strings - non-string values (falsy values) are ignored.

#### Parameters

- `...classes`: `(string | false | null | undefined | 0)[]` - Any number of class name strings or falsy values

#### Returns

- `string` - The combined class names separated by spaces

## Why @lightsound/cn?

| Feature         | @lightsound/cn | clsx/lite | clsx  |
| --------------- | -------------- | --------- | ----- |
| Strings only    | ✅             | ✅        | ❌    |
| Objects support | ❌             | ❌        | ✅    |
| Arrays support  | ❌             | ❌        | ✅    |
| Size (gzip)     | ~130B          | ~139B     | ~239B |
| Performance     | ⚡⚡⚡         | ⚡⚡      | ⚡    |

If you only use string-based class composition (the most common pattern with Tailwind CSS), `@lightsound/cn` provides the best performance.

## Compatibility with clsx/lite

`@lightsound/cn` is designed as a faster, drop-in replacement for `clsx/lite`:

```typescript
// Before
import clsx from "clsx/lite";
clsx("btn", isActive && "active", "btn-primary");

// After
import { cn } from "@lightsound/cn";
cn("btn", isActive && "active", "btn-primary");
```

### TypeScript Users

**You're fully covered!** The type definition only accepts `string | false | 0 | null | undefined`, so passing objects or arrays will result in a compile-time error:

```typescript
cn("btn", { active: true }); // ❌ TypeScript error
cn("btn", ["a", "b"]); // ❌ TypeScript error
cn("btn", isActive && "active"); // ✅ Works perfectly
```

### JavaScript Users

Note that runtime behavior differs from `clsx/lite` when passing unsupported types:

| Input              | clsx/lite | @lightsound/cn      |
| ------------------ | --------- | ------------------- |
| `{ active: true }` | `""`      | `"[object Object]"` |
| `["a", "b"]`       | `""`      | `"a,b"`             |

If you're using JavaScript, ensure your codebase only passes strings and falsy values to `cn()`.

## Tailwind CSS IntelliSense

To enable Tailwind CSS IntelliSense for `cn()`, add this to your VS Code settings:

```json
{
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## License

MIT © [lightsound](https://github.com/lightsound)
