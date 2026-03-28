import { render } from '../src/renderer';
import { FULL_INSIGHTS, DEFAULT_CONFIG } from './fixtures';
import { RenderConfig } from '../src/types';

describe('renderer dispatcher', () => {
  it('dispatches to executive template', () => {
    const cfg: RenderConfig = { ...DEFAULT_CONFIG, template: 'executive' };
    const md = render(FULL_INSIGHTS, cfg);
    expect(md).toContain('**Date Range**');
    expect(md).not.toContain('# Changelog:');
  });

  it('dispatches to technical template', () => {
    const cfg: RenderConfig = { ...DEFAULT_CONFIG, template: 'technical' };
    const md = render(FULL_INSIGHTS, cfg);
    expect(md).toContain('# Technical Changelog: owner/repo');
  });

  it('dispatches to minimal template', () => {
    const cfg: RenderConfig = { ...DEFAULT_CONFIG, template: 'minimal' };
    const md = render(FULL_INSIGHTS, cfg);
    expect(md).toContain('# owner/repo — Changelog');
  });

  it('each template produces non-empty output', () => {
    for (const template of ['executive', 'technical', 'minimal'] as const) {
      const cfg: RenderConfig = { ...DEFAULT_CONFIG, template };
      const md = render(FULL_INSIGHTS, cfg);
      expect(md.length).toBeGreaterThan(100);
    }
  });

  it('custom output path does not affect content', () => {
    const cfg1: RenderConfig = { ...DEFAULT_CONFIG, outputPath: 'foo.md' };
    const cfg2: RenderConfig = { ...DEFAULT_CONFIG, outputPath: 'bar.md' };
    expect(render(FULL_INSIGHTS, cfg1)).toBe(render(FULL_INSIGHTS, cfg2));
  });
});
