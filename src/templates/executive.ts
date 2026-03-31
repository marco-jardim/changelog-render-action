// SPDX-License-Identifier: GPL-3.0
import { InsightsV1, InsightsCommit, RenderConfig } from '../types.js';
import { formatDate, buildCompareUrl, shortSha } from '../lib/dateFormatter.js';

/**
 * Returns a long-form date like "March 30, 2026" for H1 date group headers.
 * Always uses MMMM D, YYYY regardless of the user's dateFormat preference
 * so the H1 anchors are human-readable.
 */
function formatDateLong(isoDatePrefix: string): string {
  const d = new Date(isoDatePrefix + 'T00:00:00Z');
  if (isNaN(d.getTime())) return isoDatePrefix;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/**
 * Groups commits by calendar date (YYYY-MM-DD prefix), newest date first.
 * Returns [dateKey, commits[]] pairs preserving insertion order within each group.
 */
function groupCommitsByDate(commits: InsightsCommit[]): [string, InsightsCommit[]][] {
  const map = new Map<string, InsightsCommit[]>();
  for (const c of commits) {
    const key = c.date ? c.date.slice(0, 10) : '';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(c);
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

/**
 * Renders the executive template — full rich markdown with all sections.
 * Audience: product managers, stakeholders, non-technical readers.
 *
 * When config.groupByDate is true (default): commits are grouped under H1 date
 * headers (newest first), with combined narrative sections appended at the end.
 * When config.groupByDate is false: renders the original flat section layout.
 */
export function renderExecutive(insights: InsightsV1, config: RenderConfig): string {
  const lines: string[] = [];
  const hasCommits = !!(insights.commits && insights.commits.length > 0);

  // ── Header ──────────────────────────────────────────────────────────────────
  let dateFrom = '';
  let dateTo = '';
  if (hasCommits) {
    const sorted = [...insights.commits!].sort((a, b) => a.date.localeCompare(b.date));
    dateFrom = formatDate(sorted[0].date, config.dateFormat);
    dateTo = formatDate(sorted[sorted.length - 1].date, config.dateFormat);
  } else if (insights.generated_at) {
    dateTo = formatDate(insights.generated_at, config.dateFormat);
  }
  lines.push(`**Date Range**: ${dateFrom} → ${dateTo}  `);

  if (insights.from_sha && insights.to_sha) {
    const compareUrl = buildCompareUrl(config.repoUrl, insights.from_sha, insights.to_sha);
    if (compareUrl) {
      const label = `${shortSha(insights.from_sha)}...${shortSha(insights.to_sha)}`;
      lines.push(`**Compare**: [${label}](${compareUrl})  `);
    } else {
      lines.push(
        `**Compare**: \`${shortSha(insights.from_sha)}...${shortSha(insights.to_sha)}\`  `
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

  if (config.groupByDate && hasCommits) {
    // ── Executive summary (LLM highlights) at the top ────────────────────────
    if (insights.highlights.length > 0) {
      for (const h of insights.highlights) {
        lines.push(`- ${h}`);
      }
      lines.push('');
    }

    // ── Date-grouped commit drill-down ───────────────────────────────────────
    const groups = groupCommitsByDate(insights.commits!);

    for (const [key, groupCommits] of groups) {
      const displayDate = formatDateLong(key);

      lines.push(`# ${displayDate}`);
      lines.push('');
      lines.push(`**${groupCommits.length} commit${groupCommits.length === 1 ? '' : 's'}**`);
      lines.push('');

      for (const c of groupCommits) {
        const sha = shortSha(c.sha);
        const firstLine = c.message.replace(/\n.*/s, '').trim();
        lines.push(`## ${sha} — ${firstLine}`);
        lines.push('');
        lines.push(`*${c.author}*`);
        lines.push('');
        lines.push('---');
        lines.push('');
      }
    }

    // ── Combined narrative sections ──────────────────────────────────────────
    if (insights.what_changed) {
      lines.push('## What Changed');
      lines.push('');
      lines.push(insights.what_changed);
      lines.push('');
    }

    if (insights.business_impact) {
      lines.push('## Business Impact');
      lines.push('');
      lines.push(insights.business_impact);
      lines.push('');
    }

    if (insights.engineering_evolution) {
      lines.push('## Engineering Evolution');
      lines.push('');
      lines.push(insights.engineering_evolution);
      lines.push('');
    }

    // Single combined section for Operational Risks + Mitigations to save space
    const hasRisksGrouped = insights.operational_risks.length > 0;
    const hasMitigationsGrouped = insights.mitigations.length > 0;
    if (hasRisksGrouped || hasMitigationsGrouped) {
      lines.push('## Operational Risks & Mitigations');
      lines.push('');
      if (hasRisksGrouped) {
        for (const risk of insights.operational_risks) {
          lines.push(`- ${risk}`);
        }
        lines.push('');
      }
      if (hasMitigationsGrouped) {
        lines.push('**Mitigations**');
        lines.push('');
        for (const m of insights.mitigations) {
          lines.push(`- ${m}`);
        }
        lines.push('');
      }
    }
  } else {
    // ── Original flat view (groupByDate = false or no commits) ───────────────
    if (insights.highlights.length > 0) {
      lines.push('## Highlights');
      lines.push('');
      for (const h of insights.highlights) {
        lines.push(`- ${h}`);
      }
      lines.push('');
    }

    if (insights.what_changed) {
      lines.push('## What Changed');
      lines.push('');
      lines.push(insights.what_changed);
      lines.push('');
    }

    if (insights.business_impact) {
      lines.push('## Business Impact');
      lines.push('');
      lines.push(insights.business_impact);
      lines.push('');
    }

    if (insights.engineering_evolution) {
      lines.push('## Engineering Evolution');
      lines.push('');
      lines.push(insights.engineering_evolution);
      lines.push('');
    }

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
        for (const m of insights.mitigations) {
          lines.push(`- ${m}`);
        }
        lines.push('');
      }
    }
  }

  // ── Notable Files ────────────────────────────────────────────────────────────
  if (config.includeFileEvidence && insights.notable_files.length > 0) {
    lines.push('## Notable Files');
    lines.push('');
    for (const f of insights.notable_files) {
      lines.push(`- **${f.path}** — ${f.reason}`);
    }
    lines.push('');
  }

  // ── Commit List ──────────────────────────────────────────────────────────────
  if (config.includeCommitList && hasCommits) {
    lines.push(config.groupByDate ? '## Full Commit Log' : '## Commits');
    lines.push('');
    for (const c of insights.commits!) {
      const sha = shortSha(c.sha);
      const date = formatDate(c.date, config.dateFormat);
      const msg = c.message.replace(/\n.*/s, '');
      lines.push(`- **${sha}** ${msg} (${c.author}, ${date})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
