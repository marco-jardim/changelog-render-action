import { validateInsights, validateConfig } from '../src/lib/validator';
import { FULL_INSIGHTS, DEFAULT_CONFIG } from './fixtures';
import { RenderConfig } from '../src/types';

describe('validateInsights', () => {
  it('returns no errors for a valid insights object', () => {
    const errors = validateInsights(FULL_INSIGHTS);
    expect(errors).toHaveLength(0);
  });

  it('returns error for non-object input', () => {
    const errors = validateInsights('not an object');
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].field).toBe('root');
  });

  it('returns error when repo is missing', () => {
    const data = { ...FULL_INSIGHTS, repo: '' };
    const errors = validateInsights(data);
    expect(errors.some((e) => e.field === 'repo')).toBe(true);
  });

  it('returns error when highlights is not an array', () => {
    const data = { ...FULL_INSIGHTS, highlights: 'not an array' };
    const errors = validateInsights(data);
    expect(errors.some((e) => e.field === 'highlights')).toBe(true);
  });

  it('returns error when schema_version is for v2+', () => {
    const data = { ...FULL_INSIGHTS, schema_version: '2.0' };
    const errors = validateInsights(data);
    expect(errors.some((e) => e.field === 'schema_version')).toBe(true);
  });

  it('returns error when what_changed is missing', () => {
    const data = { ...FULL_INSIGHTS, what_changed: '' };
    const errors = validateInsights(data);
    expect(errors.some((e) => e.field === 'what_changed')).toBe(true);
  });

  it('returns error when notable_files is not an array', () => {
    const data = { ...FULL_INSIGHTS, notable_files: null };
    const errors = validateInsights(data);
    expect(errors.some((e) => e.field === 'notable_files')).toBe(true);
  });
});

describe('validateConfig', () => {
  it('returns no errors for valid config', () => {
    const errors = validateConfig(DEFAULT_CONFIG);
    expect(errors).toHaveLength(0);
  });

  it('returns error when insights_path is empty', () => {
    const cfg: RenderConfig = { ...DEFAULT_CONFIG, insightsPath: '' };
    const errors = validateConfig(cfg);
    expect(errors.some((e) => e.field === 'insights_path')).toBe(true);
  });

  it('returns error for unknown template', () => {
    const cfg = { ...DEFAULT_CONFIG, template: 'unknown' as never };
    const errors = validateConfig(cfg);
    expect(errors.some((e) => e.field === 'template')).toBe(true);
  });

  it('returns error for unknown date_format', () => {
    const cfg = { ...DEFAULT_CONFIG, dateFormat: 'YYYY/MM/DD' as never };
    const errors = validateConfig(cfg);
    expect(errors.some((e) => e.field === 'date_format')).toBe(true);
  });

  it('returns error when output_path is empty', () => {
    const cfg: RenderConfig = { ...DEFAULT_CONFIG, outputPath: '' };
    const errors = validateConfig(cfg);
    expect(errors.some((e) => e.field === 'output_path')).toBe(true);
  });
});
