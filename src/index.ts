// SPDX-License-Identifier: GPL-3.0
import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';

import { RenderConfig, TemplateType, DateFormatType, InsightsV1, VALID_TEMPLATES } from './types.js';
import { validateInsights, validateConfig } from './lib/validator.js';
import { render } from './renderer.js';
import { countWords } from './lib/wordCount.js';

function parseBooleanInput(value: string, defaultValue: boolean): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() !== 'false' && value !== '0';
}

function parseTemplate(value: string): TemplateType {
  const lower = value.toLowerCase() as TemplateType;
  if (VALID_TEMPLATES.includes(lower)) return lower;
  core.warning(`Unknown template "${value}", falling back to "executive"`);
  return 'executive';
}

function parseDateFormat(value: string): DateFormatType {
  const allowed: DateFormatType[] = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'MMMM D, YYYY'];
  if (allowed.includes(value as DateFormatType)) return value as DateFormatType;
  core.warning(`Unknown date_format "${value}", falling back to "YYYY-MM-DD"`);
  return 'YYYY-MM-DD';
}

async function run(): Promise<void> {
  try {
    // ── Read inputs ────────────────────────────────────────────────────────────
    const insightsPath = core.getInput('insights_path', { required: true });
    const template = parseTemplate(core.getInput('template') || 'executive');
    const outputPath = core.getInput('output_path') || 'executive-changelog.md';
    const includeCommitList = parseBooleanInput(core.getInput('include_commit_list'), true);
    const includeFileEvidence = parseBooleanInput(core.getInput('include_file_evidence'), true);
    const groupByDate = parseBooleanInput(core.getInput('group_by_date'), true);
    const dateFormat = parseDateFormat(core.getInput('date_format') || 'YYYY-MM-DD');
    const repoUrl = core.getInput('repo_url') || '';

    const config: RenderConfig = {
      insightsPath,
      template,
      outputPath,
      includeCommitList,
      includeFileEvidence,
      groupByDate,
      dateFormat,
      repoUrl,
    };

    // ── Validate config ────────────────────────────────────────────────────────
    const configErrors = validateConfig(config);
    if (configErrors.length > 0) {
      for (const err of configErrors) {
        core.error(`Config error [${err.field}]: ${err.message}`);
      }
      core.setFailed('Invalid action configuration');
      return;
    }

    // ── Read insights file ─────────────────────────────────────────────────────
    const absoluteInsightsPath = path.resolve(insightsPath);
    if (!fs.existsSync(absoluteInsightsPath)) {
      core.setFailed(`insights file not found: ${absoluteInsightsPath}`);
      return;
    }

    let rawData: unknown;
    try {
      const rawContent = fs.readFileSync(absoluteInsightsPath, 'utf8');
      rawData = JSON.parse(rawContent);
    } catch (parseError) {
      core.setFailed(`Failed to parse insights JSON: ${String(parseError)}`);
      return;
    }

    // ── Validate insights schema ───────────────────────────────────────────────
    const insightsErrors = validateInsights(rawData);
    if (insightsErrors.length > 0) {
      for (const err of insightsErrors) {
        core.warning(`Insights validation warning [${err.field}]: ${err.message}`);
      }
    }

    const insights = rawData as InsightsV1;

    // ── Render ─────────────────────────────────────────────────────────────────
    core.info(`Rendering changelog using template: ${template}`);
    const content = render(insights, config);

    // ── Write output ───────────────────────────────────────────────────────────
    const absoluteOutputPath = path.resolve(outputPath);
    const outputDir = path.dirname(absoluteOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(absoluteOutputPath, content, 'utf8');
    core.info(`Changelog written to: ${absoluteOutputPath}`);

    // ── Set outputs ────────────────────────────────────────────────────────────
    const words = countWords(content);
    core.setOutput('report_path', absoluteOutputPath);
    core.setOutput('report_content', content);
    core.setOutput('word_count', String(words));

    core.info(`Done — ${words} words rendered`);
  } catch (error) {
    core.setFailed(`Unexpected error: ${String(error)}`);
  }
}

run();
