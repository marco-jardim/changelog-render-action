# changelog-render-action

[![CI](https://github.com/marco-jardim/changelog-render-action/actions/workflows/ci.yml/badge.svg)](https://github.com/marco-jardim/changelog-render-action/actions/workflows/ci.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

**Action 3/4** in the modular changelog pipeline.

Reads an `insights.v1.json` file (produced by [`changelog-analyze-action`](https://github.com/marco-jardim/changelog-analyze-action)) and renders it into a beautifully formatted `executive-changelog.md`. Three templates are available: `executive`, `technical`, and `minimal`.

---

## Pipeline Context

```
changelog-collect-action   →  commits.json
changelog-analyze-action   →  insights.v1.json
changelog-render-action    →  executive-changelog.md   ← you are here
changelog-publish-*        →  Google Docs / Slack / etc.
```

---

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `insights_path` | ✅ | — | Path to `insights.v1.json` |
| `template` | ❌ | `executive` | Template: `executive`, `technical`, or `minimal` |
| `output_path` | ❌ | `executive-changelog.md` | Output file path |
| `include_commit_list` | ❌ | `true` | Include commit table |
| `include_file_evidence` | ❌ | `true` | Include notable files table |
| `date_format` | ❌ | `YYYY-MM-DD` | Date format: `YYYY-MM-DD`, `DD/MM/YYYY`, or `MM/DD/YYYY` |
| `repo_url` | ❌ | `''` | Repository URL for hyperlinks (e.g. `https://github.com/owner/repo`) |

## Outputs

| Output | Description |
|--------|-------------|
| `report_path` | Absolute path to the rendered markdown file |
| `report_content` | Full markdown content (for use in downstream steps) |
| `word_count` | Approximate word count of the rendered document |

---

## Usage

### Basic (executive template)

```yaml
- name: Render Changelog
  uses: marco-jardim/changelog-render-action@v1
  with:
    insights_path: insights.v1.json
```

### Full options

```yaml
- name: Render Changelog
  id: render
  uses: marco-jardim/changelog-render-action@v1
  with:
    insights_path: insights.v1.json
    template: executive
    output_path: changelog/weekly-changelog.md
    include_commit_list: true
    include_file_evidence: true
    date_format: YYYY-MM-DD
    repo_url: https://github.com/${{ github.repository }}

- name: Print word count
  run: echo "Word count ${{ steps.render.outputs.word_count }}"

- name: Upload changelog artifact
  uses: actions/upload-artifact@v4
  with:
    name: changelog
    path: ${{ steps.render.outputs.report_path }}
```

### Complete pipeline example

```yaml
jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Collect commits
        id: collect
        uses: marco-jardim/changelog-collect-action@v1
        with:
          since: ${{ github.event.before }}

      - name: Analyze
        id: analyze
        uses: marco-jardim/changelog-analyze-action@v1
        with:
          commits_path: ${{ steps.collect.outputs.commits_path }}
          openai_api_key: ${{ secrets.OPENAI_API_KEY }}

      - name: Render
        id: render
        uses: marco-jardim/changelog-render-action@v1
        with:
          insights_path: ${{ steps.analyze.outputs.insights_path }}
          template: executive
          repo_url: https://github.com/${{ github.repository }}
```

---

## Templates

### `executive` — Full Rich Markdown

Audience: product managers, stakeholders, executives.

```markdown
# Changelog: owner/repo
**Date Range**: 2026-03-20 → 2026-03-27  
**Compare**: [abc1234...def5678](https://github.com/owner/repo/compare/abc1234...def5678)  
**Total Commits**: 12  
**Files Changed**: 24  

## Highlights
- Added OAuth2 login with Google and GitHub
- Improved database query performance by 40%

## What Changed
This week the team shipped OAuth2 authentication and refactored the database query layer...

## Business Impact
Users can now sign in with Google and GitHub. Query time improvements reduce infrastructure costs...

## Engineering Evolution
Introduced a new auth module under src/auth. Database layer now uses pgpool...

## Operational Risks
- OAuth tokens stored in memory may expire on long-running processes

**Mitigations**
- Added token refresh logic with 5-minute buffer before expiry

## Notable Files
| File | Reason |
|------|--------|
| [src/auth/oauth.ts](https://github.com/owner/repo/blob/def5678/src/auth/oauth.ts) | New OAuth2 handler |
| [src/db/pool.ts](https://github.com/owner/repo/blob/def5678/src/db/pool.ts) | Connection pooling refactor |

## Commits
| SHA | Message | Author | Date |
|-----|---------|--------|------|
| [abc1234](https://github.com/owner/repo/commit/abc1234) | feat: add OAuth2 login | alice | 2026-03-25 |
```

### `technical` — Code-Focused Markdown

Audience: engineers, on-call teams, code reviewers.

```markdown
# Technical Changelog: owner/repo
**Period**: `2026-03-20` → `2026-03-27`  
**Diff**: [abc1234...def5678](https://github.com/owner/repo/compare/abc1234...def5678)  

## Summary
- Added OAuth2 login
- Improved query performance by 40%

## Engineering Changes
Introduced a new auth module. Database layer now uses pgpool...

## What Changed
OAuth2 authentication shipped, database query layer refactored...

## Notable Files
| File | Reason | +/- |
|------|--------|-----|
| src/auth/oauth.ts | New OAuth2 handler | +120 / -0 |
| src/db/pool.ts | Connection pooling refactor | +45 / -80 |

## Operational Risks
- OAuth tokens in memory may expire

## Mitigations
- Token refresh logic added

## Commit Log
```
abc1234  2026-03-25  alice  feat: add OAuth2 login
def5678  2026-03-27  bob    perf: database connection pooling
```
```

### `minimal` — One-Pager

Audience: busy executives, release emails, Slack messages.

```markdown
# owner/repo — Changelog

**2026-03-20 → 2026-03-27**  
**Ref**: `abc1234...def5678`  

## Highlights
- Added OAuth2 login
- 40% query performance improvement

## What Changed
OAuth2 authentication shipped, database query layer refactored...

## Business Impact
Users can sign in with Google/GitHub. Reduced infrastructure costs...
```

---

## `insights.v1.json` Schema

This action expects a JSON file conforming to the `insights.v1.json` schema:

```json
{
  "schema_version": "1.0",
  "repo": "owner/repo",
  "date_from": "2026-03-20T00:00:00Z",
  "date_to": "2026-03-27T00:00:00Z",
  "base_sha": "abc1234...",
  "head_sha": "def5678...",
  "highlights": ["..."],
  "what_changed": "...",
  "business_impact": "...",
  "engineering_evolution": "...",
  "operational_risks": ["..."],
  "mitigations": ["..."],
  "notable_files": [
    { "path": "src/foo.ts", "reason": "...", "additions": 10, "deletions": 2 }
  ],
  "commits": [
    { "sha": "...", "message": "...", "author": "...", "date": "..." }
  ],
  "total_commits": 12,
  "total_files_changed": 24
}
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make changes in `src/`
4. Run `npm test` — all tests must pass
5. Run `npm run build` — `dist/index.js` must build
6. Open a pull request

### Development

```bash
# Install dependencies
npm install

# Run tests in watch mode
npm run test:watch

# Type check
npm run typecheck

# Build for production
npm run build
```

---

## License

[GPL-3.0](LICENSE) © marco-jardim
