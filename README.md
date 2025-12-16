# @lightsound/cn

A tiny, **blazing fast** utility for constructing `className` strings conditionally.

[![npm version](https://img.shields.io/npm/v/@lightsound/cn.svg)](https://www.npmjs.com/package/@lightsound/cn)
[![CI](https://github.com/lightsound/cn/actions/workflows/ci.yml/badge.svg)](https://github.com/lightsound/cn/actions/workflows/ci.yml)
[![gzip size](https://img.shields.io/badge/gzip-130B-brightgreen.svg)](https://bundlephobia.com/package/@lightsound/cn)
[![license](https://img.shields.io/npm/l/@lightsound/cn.svg)](./LICENSE)

## Features

- **Blazing Fast**: Up to 36% faster than `clsx/lite`
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

| Test Case  | @lightsound/cn | clsx/lite | Improvement    |
| ---------- | -------------- | --------- | -------------- |
| 2 strings  | 20.61 ns       | 31.99 ns  | **36% faster** |
| 3 strings  | 55.25 ns       | 63.49 ns  | **13% faster** |
| 5 strings  | 63.30 ns       | 87.31 ns  | **28% faster** |
| 10 strings | 96.66 ns       | 139.70 ns | **31% faster** |

<!-- BENCHMARK_END -->

<details>
<summary>Benchmark methodology</summary>

- **Runs**: 30 iterations per scenario
- **Iterations**: 100,000 operations per run
- **Outlier removal**: Top and bottom 10% trimmed
- **Metric**: Median (more stable than mean)
- **Warmup**: 10,000 iterations before measurement

</details>

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

## Using with Tailwind Merge

If you need to merge Tailwind CSS classes (resolving conflicts like `px-2` and `p-3`), use `tc` from `@lightsound/cn/tw-merge`:

```bash
# Install tailwind-merge as a peer dependency
bun add tailwind-merge
```

```typescript
import { tc } from "@lightsound/cn/tw-merge";

// Conflicting classes are merged intelligently
tc("px-2 py-1", "p-3");
// => 'p-3'

tc("text-red-500", "text-blue-500");
// => 'text-blue-500'

tc("bg-gray-100 text-gray-900", "bg-blue-500 text-white");
// => 'bg-blue-500 text-white'

// Works with conditional classes too
tc("text-gray-500", isActive && "text-blue-500");
// => 'text-blue-500' (if isActive is true)
```

> **Note**: `tc` requires `tailwind-merge` to be installed separately. If you only need `cn`, you don't need to install `tailwind-merge`.

## Tailwind CSS IntelliSense

To enable Tailwind CSS IntelliSense for `cn()` and `tc()`, add this to your VS Code settings:

```json
{
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["tc\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## License

MIT © [lightsound](https://github.com/lightsound)
