# AGENTS.md

Weather CLI exercise built with Bun + TypeScript. Entry point is `index.ts`; the end goal is a compiled executable binary (see `README.md` for the menu spec and API flow).

## Toolchain

- Use Bun, never Node/npm/npx: `bun <file>`, `bun install`, `bun test`, `bunx <pkg>`. Full Bun guidance lives in `bun-instructions.md` (Bun globals, `Bun.file`, `bun:sqlite`, auto `.env` loading).
- No scripts are defined in `package.json` — run files directly, e.g. `bun index.ts`.

## Commands

- Run app: `bun index.ts`
- Typecheck: `bunx tsc` (tsconfig sets `noEmit`; there is no separate lint/typecheck script)
- Tests: `bun test` (none exist yet; use `bun:test` when adding them)
- Build binary: `bun build --compile index.ts --outfile weather`

## tsconfig rules that affect how you write code

- `strict` + `verbatimModuleSyntax`: type-only imports must use `import type`.
- `noUncheckedIndexedAccess`: indexed access yields `T | undefined` and needs narrowing.
- `types: ["bun"]`: Bun globals are available; don't add Node type packages.

## Domain notes

- Weather data comes from OpenMeteo (no API key needed), two steps: geocoding API to resolve a city name to lat/lon, then the forecast API. Example URLs are in `README.md`.
- `.cursor/rules/*.mdc` is a broken symlink to a nonexistent `CLAUDE.md`; ignore it — the real instructions are `bun-instructions.md`.
- May use `bun-instructions.md` for get instructions of Bun.
