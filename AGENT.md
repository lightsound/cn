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

## Tech Stack

- Runtime: Bun
- Language: TypeScript
- Build: Bun build + tsgo (TypeScript Go)
- Test: Bun test
- Package Manager: Bun

## Commands

```bash
bun install          # Install dependencies
bun test             # Run tests
bun run build        # Build the package
bun run bench        # Run benchmarks
```

## Project Structure

```
src/           # Source code
  index.ts     # Main entry point
  index.test.ts # Tests
bench/         # Benchmarks
dist/          # Build output (git ignored)
```
