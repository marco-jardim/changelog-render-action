// SPDX-License-Identifier: GPL-3.0
import { InsightsV1, RenderConfig } from '../types.js';
import { formatDate, buildCompareUrl, shortSha } from '../lib/dateFormatter.js';

/**
 * Renders the technical template — code-focused markdown.
 * Audience: engineers, code reviewers, on-call teams.
 * Emphasises file changes, commit details, risks.
 */
export function renderTechnical(insights: InsightsV1, config: RenderConfig): string {
  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────────
  lines.push(`# Technical Changelog: ${insights.repo}`);
  lines.push('');

  let dateFrom = '';
  let dateTo = '';
  if (insights.commits && insights.commits.length > 0) {
    const sorted = [...insights.commits].sort((a, b) => a.date.localeCompare(b.date));
    dateFrom = formatDate(sorted[0].date, config.dateFormat);
    dateTo = formatDate(sorted[sorted.length - 1].date, config.dateFormat);
  } else if (insights.generated_at) {
    dateTo = formatDate(insights.generated_at, config.dateFormat);
  }
  lines.push(`**Period**: \`${dateFrom}\` → \`${dateTo}\`  `);

  if (insights.from_sha && insights.to_sha) {
    const compareUrl = buildCompareUrl(config.repoUrl, insights.from_sha, insights.to_sha);
    if (compareUrl) {
      const label = `${shortSha(insights.from_sha)}...${shortSha(insights.to_sha)}`;
      lines.push(`**Diff**: [${label}](${compareUrl})  `);
    } else {
      lines.push(
        `**Diff**: \`${shortSha(insights.from_sha)}...${shortSha(insights.to_sha)}\`  `
      );
    }
  }

  if (insights.total_commits !== undefined) {
    lines.push(`**Commits**: ${insights.total_commits}  `);
  }

  if (insights.total_files_changed !== undefined) {
    lines.push(`**Files Changed**: ${insights.total_files_changed}  `);
  }

  lines.push('');

  // ── Summary ─────────────────────────────────────────────────────────────────
  if (insights.highlights.length > 0) {
    lines.push('## Summary');
    lines.push('');
    for (const h of insights.highlights) {
      lines.push(`- ${h}`);
    }
    lines.push('');
  }

  // ── Engineering Changes ──────────────────────────────────────────────────────
  if (insights.engineering_evolution) {
    lines.push('## Engineering Changes');
    lines.push('');
    lines.push(insights.engineering_evolution);
    lines.push('');
  }

  // ── What Changed ────────────────────────────────────────────────────────────
  if (insights.what_changed) {
    lines.push('## What Changed');
    lines.push('');
    lines.push(insights.what_changed);
    lines.push('');
  }

  // ── Notable Files (detailed) ─────────────────────────────────────────────────
  if (config.includeFileEvidence && insights.notable_files.length > 0) {
    lines.push('## Notable Files');
    lines.push('');
    lines.push('| File | Reason | +/- |');
    lines.push('|------|--------|-----|');
    for (const f of insights.notable_files) {
      const filePath = config.repoUrl
        ? `[${f.path}](${config.repoUrl.replace(/\/$/, '')}/blob/${insights.to_sha || 'main'}/${f.path})`
        : `\`${f.path}\``;
      const diff =
        f.additions !== undefined && f.deletions !== undefined
          ? `+${f.additions} / -${f.deletions}`
          : '—';
      lines.push(`| ${filePath} | ${f.reason} | ${diff} |`);
    }
    lines.push('');
  }

  // ── Operational Risks ───────────────────────────────────────────────────────
  if (insights.operational_risks.length > 0) {
    lines.push('## Operational Risks');
    lines.push('');
    for (const risk of insights.operational_risks) {
      lines.push(`- ${risk}`);
    }
    lines.push('');
  }

  if (insights.mitigations.length > 0) {
    lines.push('## Mitigations');
    lines.push('');
    for (const mitigation of insights.mitigations) {
      lines.push(`- ${mitigation}`);
    }
    lines.push('');
  }

  // ── Business Context ─────────────────────────────────────────────────────────
  if (insights.business_impact) {
    lines.push('## Business Context');
    lines.push('');
    lines.push(insights.business_impact);
    lines.push('');
  }

  // ── Commit List ─────────────────────────────────────────────────────────────
  if (config.includeCommitList && insights.commits && insights.commits.length > 0) {
    lines.push('## Commit Log');
    lines.push('');
    lines.push('```');
    for (const c of insights.commits) {
      const date = formatDate(c.date, config.dateFormat);
      lines.push(`${shortSha(c.sha)}  ${date}  ${c.author}  ${c.message.split('\n')[0]}`);
    }
    lines.push('```');
    lines.push('');
  }

  return lines.join('\n');
}
