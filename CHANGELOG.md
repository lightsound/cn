# Changelog

## [2.0.1](https://github.com/lightsound/cn/compare/v2.0.0...v2.0.1) (2026-02-19)


### Bug Fixes

* add rootDir to tsconfig.build.json to fix type declaration output path ([41a9a92](https://github.com/lightsound/cn/commit/41a9a92feb40723c5b3d10f8a7c34289a1e5e439))

## [2.0.0](https://github.com/lightsound/cn/compare/v1.2.1...v2.0.0) (2026-02-19)


### ⚠ BREAKING CHANGES

* rename tc to cn in tw-merge entry point

### Features

* rename tc to cn in tw-merge entry point ([76c3908](https://github.com/lightsound/cn/commit/76c39085742b5a974877a4ad999b8f3efbaed6a5))

## [1.2.1](https://github.com/lightsound/cn/compare/v1.2.0...v1.2.1) (2025-12-16)


### Bug Fixes

* align benchmark table columns in README generation ([5f58b57](https://github.com/lightsound/cn/commit/5f58b571ba7d599f353efd3d956aa8244b4a848e))
* remove merge conflict markers from README ([c6c8749](https://github.com/lightsound/cn/commit/c6c8749a68fdebafec6b357f6122f5c340d3a3bf))

## [1.2.0](https://github.com/lightsound/cn/compare/v1.1.0...v1.2.0) (2025-12-16)


### Features

* add tc function for tailwind-merge integration ([b9ef5ce](https://github.com/lightsound/cn/commit/b9ef5ce6c7aaee81c3b82164f773cf36bde27a91))

## [1.1.0](https://github.com/lightsound/cn/compare/v1.0.3...v1.1.0) (2025-12-14)


### Features

* share benchmark results between CI and README update ([d2d121f](https://github.com/lightsound/cn/commit/d2d121fc752c6bc2af6e40be230124b0afc763a2))

## [1.0.3](https://github.com/lightsound/cn/compare/v1.0.2...v1.0.3) (2025-12-14)


### Bug Fixes

* **ci:** upgrade npm for Trusted Publishing support ([1f128ec](https://github.com/lightsound/cn/commit/1f128ecf406bc75ab366e9f88d5753c09d4d56f9))


### Performance Improvements

* increase benchmark runs to 10 for more stable results ([0295e2e](https://github.com/lightsound/cn/commit/0295e2e54b782b0b51de4e4a46ae8aba246bc141))

## [1.0.2](https://github.com/lightsound/cn/compare/v1.0.1...v1.0.2) (2025-12-14)


### Bug Fixes

* **ci:** make publish job self-contained ([eb7ee91](https://github.com/lightsound/cn/commit/eb7ee9133fa290d8284b305ff31f59bb0473bd3c))

## [1.0.1](https://github.com/lightsound/cn/compare/v1.0.0...v1.0.1) (2025-12-14)


### Bug Fixes

* **ci:** skip prepublishOnly in publish job ([a629dae](https://github.com/lightsound/cn/commit/a629dae54fae2008a9392da0ca8b543467bba846))

## 1.0.0 (2025-12-14)


### Features

* add CI benchmark and bundle size checks ([d45337d](https://github.com/lightsound/cn/commit/d45337de2bbcad18dc0831c2e86efb48e80722bd))


### Performance Improvements

* optimize cn function for consistent speed improvement ([74b9178](https://github.com/lightsound/cn/commit/74b9178c12a2cc61dc052de3294de6d3ca80b580))

## [0.1.0](https://github.com/lightsound/cn/releases/tag/v0.1.0) (2025-12-14)

### Features

- Initial release
- `cn()` function for constructing className strings conditionally
- TypeScript support with full type definitions
- Named export (`cn`) and default export
- Support for string and falsy values (`false`, `null`, `undefined`, `0`)
