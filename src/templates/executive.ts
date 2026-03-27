// SPDX-License-Identifier: GPL-3.0
import { InsightsV1, RenderConfig } from '../types.js';
import { formatDate, buildCompareUrl, shortSha } from '../lib/dateFormatter.js';

/**
 * Renders the executive template — full rich markdown with all sections.
 * Audience: product managers, stakeholders, non-technical readers.
 */
export function renderExecutive(insights: InsightsV1, config: RenderConfig): string {
  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────────
  lines.push(`# Changelog: ${insights.repo}`);
  lines.push('');

  const dateFrom = formatDate(insights.date_from, config.dateFormat);
  const dateTo = formatDate(insights.date_to, config.dateFormat);
  lines.push(`**Date Range**: ${dateFrom} → ${dateTo}  `);

  if (insights.base_sha && insights.head_sha) {
    const compareUrl = buildCompareUrl(config.repoUrl, insights.base_sha, insights.head_sha);
    if (compareUrl) {
      const label = `${shortSha(insights.base_sha)}...${shortSha(insights.head_sha)}`;
      lines.push(`**Compare**: [${label}](${compareUrl})  `);
    } else {
      lines.push(
        `**Compare**: \`${shortSha(insights.base_sha)}...${shortSha(insights.head_sha)}\`  `
      );
    }
  }

  if (insights.total_commits !== undefined) {
    lines.push(`**Total Commits**: ${insights.total_commits}  `);
  }

  if (insights.total_files_changed !== undefined) {
    lines.push(`**Files Changed**: ${insights.total_files_changed}  `);
  }

  lines.push('');

  // ── Highlights ──────────────────────────────────────────────────────────────
  if (insights.highlights.length > 0) {
    lines.push('## Highlights');
    lines.push('');
    for (const h of insights.highlights) {
      lines.push(`- ${h}`);
    }
    lines.push('');
  }

  // ── What Changed ────────────────────────────────────────────────────────────
  if (insights.what_changed) {
    lines.push('## What Changed');
    lines.push('');
    lines.push(insights.what_changed);
    lines.push('');
  }

  // ── Business Impact ─────────────────────────────────────────────────────────
  if (insights.business_impact) {
    lines.push('## Business Impact');
    lines.push('');
    lines.push(insights.business_impact);
    lines.push('');
  }

  // ── Engineering Evolution ───────────────────────────────────────────────────
  if (insights.engineering_evolution) {
    lines.push('## Engineering Evolution');
    lines.push('');
    lines.push(insights.engineering_evolution);
    lines.push('');
  }

  // ── Operational Risks ───────────────────────────────────────────────────────
  const hasRisks = insights.operational_risks.length > 0;
  const hasMitigations = insights.mitigations.length > 0;

  if (hasRisks || hasMitigations) {
    lines.push('## Operational Risks');
    lines.push('');

    if (hasRisks) {
      for (const risk of insights.operational_risks) {
        lines.push(`- ${risk}`);
      }
      lines.push('');
    }

    if (hasMitigations) {
      lines.push('**Mitigations**');
      lines.push('');
      for (const mitigation of insights.mitigations) {
        lines.push(`- ${mitigation}`);
      }
      lines.push('');
    }
  }

  // ── Notable Files ───────────────────────────────────────────────────────────
  if (config.includeFileEvidence && insights.notable_files.length > 0) {
    lines.push('## Notable Files');
    lines.push('');
    lines.push('| File | Reason |');
    lines.push('|------|--------|');
    for (const f of insights.notable_files) {
      const filePath = config.repoUrl
        ? `[${f.path}](${config.repoUrl.replace(/\/$/, '')}/blob/${insights.head_sha ?? 'main'}/${f.path})`
        : `\`${f.path}\``;
      lines.push(`| ${filePath} | ${f.reason} |`);
    }
    lines.push('');
  }

  // ── Commit List ─────────────────────────────────────────────────────────────
  if (config.includeCommitList && insights.commits && insights.commits.length > 0) {
    lines.push('## Commits');
    lines.push('');
    lines.push('| SHA | Message | Author | Date |');
    lines.push('|-----|---------|--------|------|');
    for (const c of insights.commits) {
      const shaDisplay = config.repoUrl
        ? `[${shortSha(c.sha)}](${config.repoUrl.replace(/\/$/, '')}/commit/${c.sha})`
        : `\`${shortSha(c.sha)}\``;
      const date = formatDate(c.date, config.dateFormat);
      const msg = c.message.replace(/\|/g, '\\|').replace(/\n.*/s, '');
      lines.push(`| ${shaDisplay} | ${msg} | ${c.author} | ${date} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
