import { renderExecutive } from '../src/templates/executive';
import { FULL_INSIGHTS, MINIMAL_INSIGHTS, DEFAULT_CONFIG } from './fixtures';
import { RenderConfig } from '../src/types';

describe('executive template', () => {
  it('renders repo name in the header', () => {
    const md = renderExecutive(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('# Changelog: owner/repo');
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

  it('renders notable files table with file links', () => {
    const md = renderExecutive(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Notable Files');
    expect(md).toContain('| File | Reason |');
    expect(md).toContain('src/auth/oauth.ts');
    expect(md).toContain('New OAuth2 handler');
  });

  it('renders commit table when includeCommitList is true', () => {
    const md = renderExecutive(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Commits');
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
