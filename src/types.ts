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
  files?: string[];
}

export interface InsightsFile {
  path: string;
  reason: string;
  additions?: number;
  deletions?: number;
}

export interface InsightsV1 {
  schema_version: string;
  repo: string;
  date_from: string;
  date_to: string;
  base_sha?: string;
  head_sha?: string;
  highlights: string[];
  what_changed: string;
  business_impact: string;
  engineering_evolution: string;
  operational_risks: string[];
  mitigations: string[];
  notable_files: InsightsFile[];
  commits?: InsightsCommit[];
  total_commits?: number;
  total_files_changed?: number;
}

export type TemplateType = 'executive' | 'technical' | 'minimal';

export type DateFormatType = 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';

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
export const VALID_DATE_FORMATS: DateFormatType[] = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'];
