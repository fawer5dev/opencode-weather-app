# AGENTS.md

Weather CLI exercise built with Bun + TypeScript. Entry point is `src/index.ts`; the end goal is a compiled executable binary (see `README.md` for the menu spec and API flow). Source layout follows `references/file-system.md`: `src/` split into `actions/`, `presentation/`, `storage/`, `types/`, `api/` and `utils/`.

## Toolchain

- Use Bun, never Node/npm/npx: `bun <file>`, `bun install`, `bun test`, `bunx <pkg>`. Full Bun guidance lives in `bun-instructions.md` (Bun globals, `Bun.file`, `bun:sqlite`, auto `.env` loading).
- `package.json` only defines `start`/`dev`/`build` scripts — run files directly otherwise, e.g. `bun src/index.ts`.

## Commands

- Run app: `bun src/index.ts`
- Typecheck: `bunx tsc` (tsconfig sets `noEmit`; there is no separate lint/typecheck script)
- Tests: `bun test` (none exist yet; use `bun:test` when adding them)
- Build binary: `bun build --compile src/index.ts --outfile weather`

## tsconfig rules that affect how you write code

- `strict` + `verbatimModuleSyntax`: type-only imports must use `import type`.
- `noUncheckedIndexedAccess`: indexed access yields `T | undefined` and needs narrowing.
- `types: ["bun"]`: Bun globals are available; don't add Node type packages.

## Domain notes

- Weather data comes from OpenMeteo (no API key needed), two steps: geocoding API to resolve a city name to lat/lon, then the forecast API. Example URLs are in `README.md`.
- Data persists in `~/.config/weather-cli/` (`cities.json` + `settings.json`); a legacy `~/.weather-cli.json` is migrated on first run and left untouched.
- `.cursor/rules/*.mdc` is a broken symlink to a nonexistent `CLAUDE.md`; ignore it — the real instructions are `bun-instructions.md`.
- May use `bun-instructions.md` for get instructions of Bun.
