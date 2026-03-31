import { renderExecutive } from '../src/templates/executive';
import { FULL_INSIGHTS, MINIMAL_INSIGHTS, DEFAULT_CONFIG } from './fixtures';
import { InsightsV1, RenderConfig } from '../src/types';

describe('executive template', () => {
  it('renders repo name in the header', () => {
    const md = renderExecutive(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).not.toContain('# Changelog:');
    expect(md).toMatch(/^\*\*Date Range\*\*/);
  });

  it('renders date range with default YYYY-MM-DD format', () => {
    const md = renderExecutive(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('**Date Range**: 2026-03-20 → 2026-03-27');
  });

  it('renders compare URL with shortened SHAs', () => {
    const md = renderExecutive(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('abc1234...def5678');
    expect(md).toContain('https://github.com/owner/repo/compare/');
  });

  it('renders all highlights as bullet list', () => {
    const md = renderExecutive(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Highlights');
    expect(md).toContain('- Added OAuth2 login');
    expect(md).toContain('- Improved query performance by 40%');
  });

  it('renders what_changed section', () => {
    const md = renderExecutive(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## What Changed');
    expect(md).toContain('OAuth2 authentication');
  });

  it('renders business_impact section', () => {
    const md = renderExecutive(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Business Impact');
    expect(md).toContain('infrastructure costs');
  });

  it('renders engineering_evolution section', () => {
    const md = renderExecutive(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Engineering Evolution');
    expect(md).toContain('auth module');
  });

  it('renders operational risks and mitigations', () => {
    const md = renderExecutive(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Operational Risks');
    expect(md).toContain('OAuth tokens stored in memory');
    expect(md).toContain('**Mitigations**');
    expect(md).toContain('token refresh logic');
  });

  it('renders notable files as bullet list', () => {
    const md = renderExecutive(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Notable Files');
    expect(md).not.toContain('| File | Reason |');
    expect(md).toContain('- **src/auth/oauth.ts**');
    expect(md).toContain('New OAuth2 handler');
  });

  it('renders commit list when includeCommitList is true', () => {
    const md = renderExecutive(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Commits');
    expect(md).not.toContain('| SHA | Message | Author | Date |');
    expect(md).toContain('feat: add OAuth2 login');
  });

  it('omits commit table when includeCommitList is false', () => {
    const cfg: RenderConfig = { ...DEFAULT_CONFIG, includeCommitList: false };
    const md = renderExecutive(FULL_INSIGHTS, cfg);
    expect(md).not.toContain('## Commits');
  });

  it('omits file table when includeFileEvidence is false', () => {
    const cfg: RenderConfig = { ...DEFAULT_CONFIG, includeFileEvidence: false };
    const md = renderExecutive(FULL_INSIGHTS, cfg);
    expect(md).not.toContain('## Notable Files');
  });

  it('renders total_commits and total_files_changed metadata', () => {
    const md = renderExecutive(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('**Total Commits**: 2');
    expect(md).toContain('**Files Changed**: 4');
  });

  it('handles empty operational_risks gracefully', () => {
    const md = renderExecutive(MINIMAL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).not.toContain('## Operational Risks');
  });

  it('handles empty notable_files gracefully', () => {
    const md = renderExecutive(MINIMAL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).not.toContain('## Notable Files');
  });

  it('renders date in DD/MM/YYYY format when specified', () => {
    const cfg: RenderConfig = { ...DEFAULT_CONFIG, dateFormat: 'DD/MM/YYYY' };
    const md = renderExecutive(FULL_INSIGHTS, cfg);
    expect(md).toContain('20/03/2026 → 27/03/2026');
  });

  it('renders without compare link when repoUrl is empty', () => {
    const cfg: RenderConfig = { ...DEFAULT_CONFIG, repoUrl: '' };
    const md = renderExecutive(FULL_INSIGHTS, cfg);
    // Should still include shortened sha but no hyperlink
    expect(md).toContain('abc1234...def5678');
    // The backtick code format is used when no URL
    expect(md).toContain('`abc1234...def5678`');
  });
});

describe('renderExecutive – groupByDate mode', () => {
  const groupConfig: RenderConfig = { ...DEFAULT_CONFIG, groupByDate: true };

  it('groups commits under H1 date headings, newest first', () => {
    const md = renderExecutive(FULL_INSIGHTS, groupConfig);
    expect(md).toContain('# March 27, 2026');
    expect(md).toContain('# March 20, 2026');
    const idxNewer = md.indexOf('# March 27, 2026');
    const idxOlder = md.indexOf('# March 20, 2026');
    expect(idxNewer).toBeLessThan(idxOlder);
  });

  it('each commit produces an H2 heading with short SHA and message', () => {
    const md = renderExecutive(FULL_INSIGHTS, groupConfig);
    expect(md).toContain('## def5678 — perf: database connection pooling');
    expect(md).toContain('## abc1234 — feat: add OAuth2 login');
  });

  it('renders highlights as bullets above all date groups (executive overview), without a Highlights heading', () => {
    const md = renderExecutive(FULL_INSIGHTS, groupConfig);
    expect(md).toContain('- Added OAuth2 login');
    expect(md).toContain('- Improved query performance by 40%');
    expect(md).not.toContain('## Highlights');
    // Highlights must appear before the first (newest) H1 date heading
    const idxNewestH1 = md.indexOf('# March 27, 2026');
    const idxHighlight = md.indexOf('- Added OAuth2 login');
    expect(idxHighlight).toBeLessThan(idxNewestH1);
  });

  it('renders combined narrative sections (What Changed, Business Impact, Engineering Evolution) after all date groups', () => {
    const md = renderExecutive(FULL_INSIGHTS, groupConfig);
    expect(md).toContain('## What Changed');
    expect(md).toContain('## Business Impact');
    expect(md).toContain('## Engineering Evolution');
    // All narrative sections must appear after the last date group heading
    const lastGroupIdx = Math.max(md.indexOf('# March 27, 2026'), md.indexOf('# March 20, 2026'));
    expect(md.indexOf('## What Changed')).toBeGreaterThan(lastGroupIdx);
    expect(md.indexOf('## Business Impact')).toBeGreaterThan(lastGroupIdx);
    expect(md.indexOf('## Engineering Evolution')).toBeGreaterThan(lastGroupIdx);
  });

  it('combines operational risks and mitigations into one "Operational Risks & Mitigations" section', () => {
    const md = renderExecutive(FULL_INSIGHTS, groupConfig);
    expect(md).toContain('## Operational Risks & Mitigations');
    // Must NOT produce the standalone flat-mode heading
    expect(md).not.toMatch(/^## Operational Risks$/m);
    expect(md).toContain('OAuth tokens stored in memory');
    expect(md).toContain('token refresh logic');
  });

  it('renders "Full Commit Log" header (not "Commits") when groupByDate is true', () => {
    const md = renderExecutive(FULL_INSIGHTS, groupConfig);
    expect(md).toContain('## Full Commit Log');
    expect(md).not.toContain('## Commits');
  });

  it('single commit renders with singular label and correct date heading', () => {
    const singleInsights: InsightsV1 = {
      ...FULL_INSIGHTS,
      commits: [FULL_INSIGHTS.commits![0]],
      total_commits: 1,
    };
    const md = renderExecutive(singleInsights, groupConfig);
    expect(md).toContain('# March 20, 2026');
    expect(md).toContain('**1 commit**');
    expect(md).toContain('## abc1234 — feat: add OAuth2 login');
    // Only one H1 date heading should be present
    expect(md).not.toContain('# March 27, 2026');
  });

  it('falls back to flat view and still renders narrative sections when commits array is empty', () => {
    const noCommitsInsights: InsightsV1 = {
      ...FULL_INSIGHTS,
      commits: [],
      total_commits: 0,
    };
    const md = renderExecutive(noCommitsInsights, groupConfig);
    // No H1 date-group headings should appear
    expect(md).not.toMatch(/^# \w+ \d+, \d{4}/m);
    // Flat-view narrative sections should still render
    expect(md).toContain('## Highlights');
    expect(md).toContain('## What Changed');
    expect(md).toContain('## Business Impact');
  });

  it('falls back to flat view for MINIMAL_INSIGHTS (no commits property) with groupByDate true', () => {
    const md = renderExecutive(MINIMAL_INSIGHTS, groupConfig);
    expect(md).not.toMatch(/^# \w+ \d+, \d{4}/m);
    expect(md).toContain('## What Changed');
    expect(md).not.toContain('## Operational Risks');
  });
});
