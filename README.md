# @lightsound/cn

A tiny, **blazing fast** utility for constructing `className` strings conditionally.

[![npm version](https://img.shields.io/npm/v/@lightsound/cn.svg)](https://www.npmjs.com/package/@lightsound/cn)
[![CI](https://github.com/lightsound/cn/actions/workflows/ci.yml/badge.svg)](https://github.com/lightsound/cn/actions/workflows/ci.yml)
[![gzip size](https://img.shields.io/badge/gzip-130B-brightgreen.svg)](https://bundlephobia.com/package/@lightsound/cn)
[![license](https://img.shields.io/npm/l/@lightsound/cn.svg)](./LICENSE)

## Features

- **Blazing Fast**: Up to 28% faster than `clsx/lite`
- **Tiny**: ~130B gzipped (smaller than clsx/lite!)
- **TypeScript**: Full type support out of the box
- **Simple API**: Strings only - no objects, no arrays, maximum performance
- **Zero Dependencies**: No external dependencies

## Why @lightsound/cn?

| Feature         | @lightsound/cn | clsx/lite | clsx  |
| --------------- | -------------- | --------- | ----- |
| Strings only    | ✅             | ✅        | ❌    |
| Objects support | ❌             | ❌        | ✅    |
| Arrays support  | ❌             | ❌        | ✅    |
| Size (gzip)     | ~130B          | ~141B     | ~239B |
| Performance     | ⚡⚡⚡         | ⚡⚡      | ⚡    |

If you only use string-based class composition (the most common pattern with Tailwind CSS), `@lightsound/cn` provides the best performance.

## Benchmarks

> Benchmarks are run on every CI build. See the [latest CI run](https://github.com/lightsound/cn/actions/workflows/ci.yml) for up-to-date results.

<!-- BENCHMARK_START -->
| Test Case | @lightsound/cn | clsx/lite | Improvement |
| --------- | -------------- | --------- | ----------- |
| 2 strings | 36.53 ns | 48.57 ns | **25% faster** |
| 3 strings | 50.79 ns | 70.63 ns | **28% faster** |
| 5 strings | 68.34 ns | 90.87 ns | **25% faster** |
| 10 strings | 105.81 ns | 143.69 ns | **26% faster** |
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

## API

### `cn(...classes)`

Combines class names into a single string. Only accepts strings - non-string values (falsy values) are ignored.

#### Parameters

- `...classes`: `(string | false | null | undefined | 0)[]` - Any number of class name strings or falsy values

#### Returns

- `string` - The combined class names separated by spaces

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
