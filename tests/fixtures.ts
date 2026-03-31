import { InsightsV1, RenderConfig } from '../src/types.js';

export const FULL_INSIGHTS: InsightsV1 = {
  schema_version: '1.0',
  repo: 'owner/repo',
  from_sha: 'abc1234abc1234abc1234abc1234abc1234abc1234',
  to_sha: 'def5678def5678def5678def5678def5678def5678',
  generated_at: '2026-03-27T12:00:00Z',
  highlights: ['Added OAuth2 login', 'Improved query performance by 40%'],
  what_changed:
    'This week the team shipped OAuth2 authentication and refactored the database query layer to use connection pooling.',
  business_impact:
    'Users can now sign in with Google and GitHub. Query time improvements reduce infrastructure costs.',
  engineering_evolution:
    'Introduced a new auth module under src/auth. Database layer now uses pgpool with automatic reconnection.',
  operational_risks: ['OAuth tokens stored in memory may expire on long-running processes'],
  mitigations: ['Added token refresh logic with 5-minute buffer before expiry'],
  notable_files: [
    { path: 'src/auth/oauth.ts', reason: 'New OAuth2 handler', additions: 120, deletions: 0 },
    { path: 'src/db/pool.ts', reason: 'Connection pooling refactor', additions: 45, deletions: 80 },
  ],
  commits: [
    {
      sha: 'abc1234abc1234abc1234abc1234abc1234abc1234',
      message: 'feat: add OAuth2 login',
      author: 'alice',
      date: '2026-03-20T10:00:00Z',
    },
    {
      sha: 'def5678def5678def5678def5678def5678def5678',
      message: 'perf: database connection pooling',
      author: 'bob',
      date: '2026-03-27T08:00:00Z',
    },
  ],
  total_commits: 2,
  total_files_changed: 4,
};

export const MINIMAL_INSIGHTS: InsightsV1 = {
  schema_version: '1.0',
  repo: 'owner/minimal',
  from_sha: 'aaa1111aaa1111aaa1111aaa1111aaa1111aaa1111',
  to_sha: 'bbb2222bbb2222bbb2222bbb2222bbb2222bbb2222',
  generated_at: '2026-03-07T12:00:00Z',
  highlights: ['Bug fix release'],
  what_changed: 'Fixed a critical null pointer in the payment flow.',
  business_impact: 'Prevents checkout failures for users with empty cart.',
  engineering_evolution: 'Added null guard in PaymentService.process().',
  operational_risks: [],
  mitigations: [],
  notable_files: [],
};

export const DEFAULT_CONFIG: RenderConfig = {
  insightsPath: 'insights.v1.json',
  template: 'executive',
  outputPath: 'executive-changelog.md',
  includeCommitList: true,
  includeFileEvidence: true,
  groupByDate: false,
  dateFormat: 'YYYY-MM-DD',
  repoUrl: 'https://github.com/owner/repo',
};
