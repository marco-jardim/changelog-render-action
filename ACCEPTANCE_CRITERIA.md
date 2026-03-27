# Acceptance Criteria

These criteria must all pass before `v1.0.0` is tagged.

## Functional

- [x] Reads `insights.v1.json` from the path specified in `insights_path` input
- [x] Renders `executive` template with all sections: Highlights, What Changed, Business Impact, Engineering Evolution, Operational Risks, Mitigations, Notable Files
- [x] Renders `technical` template with engineering-focused layout and +/- diff column
- [x] Renders `minimal` template as a one-pager (no Risks, no Files, no Commits)
- [x] Outputs `report_path` with the absolute path to the rendered file
- [x] Outputs `report_content` with the full markdown text
- [x] Outputs `word_count` with an approximate word count integer
- [x] `include_commit_list: false` omits the commit table
- [x] `include_file_evidence: false` omits the notable files table
- [x] `date_format: DD/MM/YYYY` formats dates accordingly
- [x] `repo_url` generates clickable compare URL and file links
- [x] Empty `operational_risks` / `mitigations` arrays produce no section heading
- [x] Empty `notable_files` array produces no section heading
- [x] Missing optional fields (base_sha, head_sha, commits, total_commits) handled gracefully

## Quality

- [x] All 74 Jest tests pass with `npm test`
- [x] `dist/index.js` builds successfully with `npm run build:bundle`
- [x] TypeScript strict mode — no `as any`, `@ts-ignore`, `@ts-expect-error`
- [x] No `node_modules/` in git history

## Documentation

- [x] `README.md` with inputs/outputs table, usage examples, all 3 template previews
- [x] `action.yml` with complete input/output definitions
- [x] `ACCEPTANCE_CRITERIA.md` (this file)
- [x] `DEFINITION_OF_DONE.md`
- [x] `LICENSE` (GPL-3.0)

## CI/CD

- [x] `.github/workflows/ci.yml` runs tests and build on push/PR
- [x] GitHub repo `marco-jardim/changelog-render-action` is public
- [x] `v1.0.0` release tag created on GitHub
