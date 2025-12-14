# Agent Instructions

This file provides instructions for AI agents working on this project.

## Commit Messages

This project uses **Conventional Commits**. All commit messages must follow this format:

```
<type>: <description>
```

### Types

| Type       | Description                                             | Version Bump          |
| ---------- | ------------------------------------------------------- | --------------------- |
| `feat`     | New feature                                             | minor (0.1.0 → 0.2.0) |
| `fix`      | Bug fix                                                 | patch (0.1.0 → 0.1.1) |
| `docs`     | Documentation only                                      | none                  |
| `style`    | Code style changes (whitespace, formatting)             | none                  |
| `refactor` | Code change that neither fixes a bug nor adds a feature | none                  |
| `perf`     | Performance improvement                                 | patch                 |
| `test`     | Adding or updating tests                                | none                  |
| `chore`    | Build process or tool changes                           | none                  |

### Examples

```
feat: add support for array inputs
fix: handle empty string correctly
docs: update README examples
refactor: simplify cn function logic
test: add edge case tests for falsy values
chore: update dependencies
```

### Breaking Changes

For breaking changes, add `!` after the type or include `BREAKING CHANGE:` in the body:

```
feat!: remove deprecated API
```

### Rules

- Type must be **lowercase** (`feat` ✅ / `Feat` ❌)
- Add **colon and space** after type (`feat: ` ✅ / `feat ` ❌)
- Description starts with **lowercase** (`feat: add feature` ✅ / `feat: Add feature` ❌)
- No **period** at the end of description
- **No scope** — use `feat: add feature` not `feat(core): add feature`

## Git Hooks

This project uses **Husky** with the following hooks:

| Hook         | Action                                         |
| ------------ | ---------------------------------------------- |
| `pre-commit` | Runs `bun test` before each commit             |
| `commit-msg` | Validates commit message format via commitlint |

> ⚠️ Commits will fail if tests don't pass or commit message format is invalid.

## Quality Gates

CI enforces the following requirements. All changes must satisfy these:

| Requirement | Description                                                                      |
| ----------- | -------------------------------------------------------------------------------- |
| Bundle size | Must be **strictly smaller** than `clsx/lite` (raw **and** gzip)                 |
| Benchmark   | Must be **faster** than `clsx/lite` in **ALL scenarios** (CI uses averaged runs) |
| Tests       | All tests must pass                                                              |
| Build       | Build must succeed                                                               |

## Development Workflow

Follow this workflow when making changes:

```
1. Make changes (usually `src/index.ts`; update tests/README as needed)
2. bun test              # Verify tests pass
3. bun run build         # Verify build succeeds
4. bun run check-size    # Verify bundle size < clsx/lite
5. (optional) bun run bench:ci # CI runs this always; run locally to pre-check
6. git commit            # Hooks will run tests + validate message
```

> 💡 The pre-commit hook runs **only** `bun test`. CI will also run build, size check, and benchmarks.

## Tech Stack

- Runtime: Bun
- Language: TypeScript
- Build: Bun build + tsgo (TypeScript Go)
- Test: Bun test
- Package Manager: Bun

### About tsgo

**tsgo** is the native TypeScript compiler written in Go (`@typescript/native-preview`).
It is used only for generating `.d.ts` type definitions (faster than `tsc`).
JavaScript output is handled by Bun's bundler.

## Commands

```bash
# Core
bun install              # Install dependencies
bun test                 # Run tests
bun run test:watch       # Run tests in watch mode
bun run build            # Build the package

# Benchmarks
bun run bench            # Run benchmarks (interactive)
bun run bench:ci         # Run benchmarks (CI mode)

# Utilities
bun run check-size       # Verify bundle size < clsx/lite
bun run update-readme    # Update README with benchmark results (requires `bun run build` first)
```

## CI/CD

This project uses **GitHub Actions** for CI/CD:

1. **Test**: Runs on all PRs and pushes to main
   - Runs tests, build, size check, and benchmarks
2. **Update README**: Auto-updates benchmark results in README on main
3. **Release Please**: Creates release PRs automatically based on commits
4. **Publish**: Publishes to npm when a release is created (with provenance)

## Project Structure

```
src/
  index.ts              # Main entry point (cn function)
  index.test.ts         # Tests

bench/
  index.ts              # Interactive benchmarks
  ci.ts                 # CI benchmarks
  scenarios.ts          # Benchmark scenarios
  scaling.ts            # Scaling benchmarks

scripts/
  check-size.ts         # Bundle size verification
  update-readme.ts      # README auto-updater

.github/
  workflows/
    ci.yml              # CI/CD workflow

.husky/
  pre-commit            # Pre-commit hook (runs tests)
  commit-msg            # Commit message validation

dist/                   # Build output (git ignored)

# Config files
tsconfig.json           # TypeScript config (development)
tsconfig.build.json     # TypeScript config (build)
commitlint.config.js    # Commitlint config
```

## Change Guidelines

When making changes, update the relevant files:

| Change Type     | Files to Update                      |
| --------------- | ------------------------------------ |
| Feature/Bug fix | `src/index.ts`, `src/index.test.ts`  |
| API change      | Above + `README.md` (usage examples) |
| Performance     | Above + verify with `bun run bench`  |
| New benchmark   | `bench/scenarios.ts`                 |

> ⚠️ Do NOT manually edit `CHANGELOG.md` — it is auto-generated by Release Please.
