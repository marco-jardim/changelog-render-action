import { formatDate, buildCompareUrl, shortSha } from '../src/lib/dateFormatter';

describe('formatDate', () => {
  const isoDate = '2026-03-27T12:00:00Z';

  it('formats in YYYY-MM-DD', () => {
    expect(formatDate(isoDate, 'YYYY-MM-DD')).toBe('2026-03-27');
  });

  it('formats in DD/MM/YYYY', () => {
    expect(formatDate(isoDate, 'DD/MM/YYYY')).toBe('27/03/2026');
  });

  it('formats in MM/DD/YYYY', () => {
    expect(formatDate(isoDate, 'MM/DD/YYYY')).toBe('03/27/2026');
  });

  it('returns empty string for empty input', () => {
    expect(formatDate('', 'YYYY-MM-DD')).toBe('');
  });

  it('returns original string for invalid date', () => {
    expect(formatDate('not-a-date', 'YYYY-MM-DD')).toBe('not-a-date');
  });
});

describe('buildCompareUrl', () => {
  it('builds compare URL with full SHAs', () => {
    const url = buildCompareUrl(
      'https://github.com/owner/repo',
      'abc1234abc1234abc1234',
      'def5678def5678def5678'
    );
    expect(url).toContain('/compare/abc1234abc1234abc1234...def5678def5678def5678');
  });

  it('returns empty string when repoUrl is empty', () => {
    expect(buildCompareUrl('', 'abc', 'def')).toBe('');
  });

  it('returns empty string when baseSha is empty', () => {
    expect(buildCompareUrl('https://github.com/owner/repo', '', 'def')).toBe('');
  });

  it('strips trailing slash from repoUrl', () => {
    const url = buildCompareUrl('https://github.com/owner/repo/', 'aaa', 'bbb');
    expect(url).not.toContain('//compare');
  });
});

describe('shortSha', () => {
  it('returns first 7 characters', () => {
    expect(shortSha('abc1234def5678')).toBe('abc1234');
  });

  it('returns empty string for empty input', () => {
    expect(shortSha('')).toBe('');
  });
});
