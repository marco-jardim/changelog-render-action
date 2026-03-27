"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMinimal = renderMinimal;
const dateFormatter_js_1 = require("../lib/dateFormatter.js");
/**
 * Renders the minimal template — one-pager with highlights and what changed.
 * Audience: busy executives, release emails, Slack posts.
 * Omits: risks, mitigations, file evidence, commit list.
 */
function renderMinimal(insights, config) {
    const lines = [];
    // ── Header ──────────────────────────────────────────────────────────────────
    lines.push(`# ${insights.repo} — Changelog`);
    lines.push('');
    const dateFrom = (0, dateFormatter_js_1.formatDate)(insights.date_from, config.dateFormat);
    const dateTo = (0, dateFormatter_js_1.formatDate)(insights.date_to, config.dateFormat);
    lines.push(`**${dateFrom} → ${dateTo}**  `);
    if (insights.base_sha && insights.head_sha) {
        lines.push(`**Ref**: \`${(0, dateFormatter_js_1.shortSha)(insights.base_sha)}...${(0, dateFormatter_js_1.shortSha)(insights.head_sha)}\`  `);
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
//# sourceMappingURL=minimal.js.map