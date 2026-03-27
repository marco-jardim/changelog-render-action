import { renderTechnical } from '../src/templates/technical';
import { FULL_INSIGHTS, DEFAULT_CONFIG } from './fixtures';
import { RenderConfig } from '../src/types';

describe('technical template', () => {
  it('renders technical-specific header', () => {
    const md = renderTechnical(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('# Technical Changelog: owner/repo');
  });

  it('renders file table with +/- diff column', () => {
    const md = renderTechnical(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Notable Files');
    expect(md).toContain('| File | Reason | +/- |');
    expect(md).toContain('+120 / -0');
    expect(md).toContain('+45 / -80');
  });

  it('renders engineering changes section', () => {
    const md = renderTechnical(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Engineering Changes');
    expect(md).toContain('pgpool');
  });

  it('renders commit log as code block', () => {
    const md = renderTechnical(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Commit Log');
    expect(md).toContain('```');
    expect(md).toContain('feat: add OAuth2 login');
  });

  it('renders operational risks as separate section', () => {
    const md = renderTechnical(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Operational Risks');
    expect(md).toContain('OAuth tokens stored in memory');
  });

  it('renders mitigations as separate section', () => {
    const md = renderTechnical(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Mitigations');
    expect(md).toContain('token refresh logic');
  });

  it('shows — for files with no diff info', () => {
    const insights = {
      ...FULL_INSIGHTS,
      notable_files: [{ path: 'src/main.ts', reason: 'Core file' }],
    };
    const md = renderTechnical(insights, DEFAULT_CONFIG);
    expect(md).toContain('—');
  });

  it('omits file table when includeFileEvidence is false', () => {
    const cfg: RenderConfig = { ...DEFAULT_CONFIG, includeFileEvidence: false };
    const md = renderTechnical(FULL_INSIGHTS, cfg);
    expect(md).not.toContain('## Notable Files');
  });

  it('handles empty commits array gracefully', () => {
    const insights = { ...FULL_INSIGHTS, commits: [] };
    const md = renderTechnical(insights, DEFAULT_CONFIG);
    expect(md).not.toContain('## Commit Log');
  });

  it('renders business context (not impact) label', () => {
    const md = renderTechnical(FULL_INSIGHTS, DEFAULT_CONFIG);
    expect(md).toContain('## Business Context');
  });
});
