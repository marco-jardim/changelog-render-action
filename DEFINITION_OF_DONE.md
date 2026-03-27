# Definition of Done

A feature or task is considered **done** when ALL of the following are true:

## Code Quality

- [x] Code written in TypeScript with `strict: true`
- [x] No `as any`, `@ts-ignore`, or `@ts-expect-error` suppressions
- [x] No empty `catch` blocks — all errors are surfaced
- [x] Named imports only — no wildcard `import *`
- [x] All functions have clear, single responsibilities

## Tests

- [x] Unit tests written for all new logic
- [x] All tests pass: `npm test` exits with code 0
- [x] Test coverage reported for all `src/**/*.ts` files
- [x] Tests cover happy paths, edge cases, and error conditions
- [x] At minimum 10 test cases per component under test

## Build

- [x] `npm run build` succeeds and produces `dist/index.js`
- [x] `npx tsc --noEmit` passes with no type errors
- [x] `dist/index.js` is committed and up-to-date with source

## Action Contract

- [x] `action.yml` accurately describes all inputs and outputs
- [x] All inputs have descriptions and defaults where applicable
- [x] All outputs have descriptions
- [x] `runs.using` is set to `node20`

## Documentation

- [x] `README.md` updated with any new inputs, outputs, or behaviour
- [x] Usage example in README reflects current API
- [x] Breaking changes documented if applicable

## Repository

- [x] `node_modules/` is in `.gitignore` and not tracked
- [x] No secrets or credentials in any committed file
- [x] `ACCEPTANCE_CRITERIA.md` reviewed and all boxes checked
- [x] CI workflow passes on the master branch
- [x] Release tag created (for releases): `gh release create vX.Y.Z`
