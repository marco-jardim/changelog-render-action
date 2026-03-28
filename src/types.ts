// SPDX-License-Identifier: GPL-3.0
/**
 * Types for insights.v1.json schema (output of changelog-analyze-action)
 * and renderer configuration.
 */

export interface InsightsCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface InsightsFile {
  path: string;
  reason: string;
  additions?: number;
  deletions?: number;
}

export interface InsightsV1 {
  schema_version: string;
  idempotency_key?: string;
  repo: string;
  from_sha: string;
  to_sha: string;
  generated_at: string;
  provider?: string;
  model?: string;
  prompt_profile?: string;
  language?: string;
  highlights: string[];
  what_changed: string;
  business_impact: string;
  engineering_evolution: string;
  operational_risks: string[];
  mitigations: string[];
  notable_files: InsightsFile[];
  fallback_used?: boolean;
  commits?: InsightsCommit[];
  total_commits?: number;
  total_files_changed?: number;
}

export type TemplateType = 'executive' | 'technical' | 'minimal';

export type DateFormatType = 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'MMMM D, YYYY';

export interface RenderConfig {
  insightsPath: string;
  template: TemplateType;
  outputPath: string;
  includeCommitList: boolean;
  includeFileEvidence: boolean;
  dateFormat: DateFormatType;
  repoUrl: string;
}

export interface RenderResult {
  reportPath: string;
  reportContent: string;
  wordCount: number;
}

export const VALID_TEMPLATES: TemplateType[] = ['executive', 'technical', 'minimal'];
export const VALID_DATE_FORMATS: DateFormatType[] = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'MMMM D, YYYY'];
