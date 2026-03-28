// SPDX-License-Identifier: GPL-3.0
import { InsightsV1, RenderConfig } from '../types.js';
import { formatDate, shortSha } from '../lib/dateFormatter.js';

/**
 * Renders the minimal template — one-pager with highlights and what changed.
 * Audience: busy executives, release emails, Slack posts.
 * Omits: risks, mitigations, file evidence, commit list.
 */
export function renderMinimal(insights: InsightsV1, config: RenderConfig): string {
  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────────
  lines.push(`# ${insights.repo} — Changelog`);
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
  lines.push(`**${dateFrom} → ${dateTo}**  `);

  if (insights.from_sha && insights.to_sha) {
    lines.push(
      `**Ref**: \`${shortSha(insights.from_sha)}...${shortSha(insights.to_sha)}\`  `
    );
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

  // ── Business Impact (brief) ──────────────────────────────────────────────────
  if (insights.business_impact) {
    lines.push('## Business Impact');
    lines.push('');
    lines.push(insights.business_impact);
    lines.push('');
  }

  // NOTE: Minimal template intentionally omits:
  //   - Operational Risks / Mitigations
  //   - Notable Files table
  //   - Commit list
  //   - Engineering Evolution deep-dive
  // Use `template: executive` or `template: technical` for full detail.

  return lines.join('\n');
}
