import { renderMinimal } from '../src/templates/minimal';
import { FULL_INSIGHTS, DEFAULT_CONFIG } from './fixtures';

describe('minimal template', () => {
  it('renders a short header', () => {
    const md = renderMinimal(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('# owner/repo — Changelog');
  });

  it('renders highlights section', () => {
    const md = renderMinimal(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Highlights');
    expect(md).toContain('- Added OAuth2 login');
  });

  it('renders what changed section', () => {
    const md = renderMinimal(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## What Changed');
  });

  it('renders business impact section', () => {
    const md = renderMinimal(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Business Impact');
  });

  it('omits operational risks section', () => {
    const md = renderMinimal(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).not.toContain('## Operational Risks');
  });

  it('omits mitigations', () => {
    const md = renderMinimal(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).not.toContain('Mitigations');
  });

  it('omits notable files table', () => {
    const md = renderMinimal(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).not.toContain('## Notable Files');
  });

  it('omits commit list', () => {
    const md = renderMinimal(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).not.toContain('## Commits');
    expect(md).not.toContain('## Commit Log');
  });

  it('omits engineering evolution deep dive', () => {
    const md = renderMinimal(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).not.toContain('## Engineering Evolution');
    expect(md).not.toContain('## Engineering Changes');
  });

  it('includes date range in bold', () => {
    const md = renderMinimal(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('**2026-03-20 → 2026-03-27**');
  });

  it('renders short SHA ref when SHAs present', () => {
    const md = renderMinimal(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('abc1234...def5678');
  });

  it('renders without SHA ref when SHAs absent', () => {
    const insights = { ...FULL_INSIGHTS, base_sha: undefined, head_sha: undefined };
    const md = renderMinimal(insights, DEFAULT_CONFIG);
    expect(md).not.toContain('**Ref**');
  });
});
