"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.buildCompareUrl = buildCompareUrl;
exports.shortSha = shortSha;
/**
 * Formats an ISO date string according to the specified format.
 * Falls back to the original string if parsing fails.
 */
function formatDate(isoDate, format) {
    if (!isoDate)
        return '';
    const d = new Date(isoDate);
    if (isNaN(d.getTime()))
        return isoDate;
    const yyyy = d.getUTCFullYear().toString();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    switch (format) {
        case 'YYYY-MM-DD':
            return `${yyyy}-${mm}-${dd}`;
        case 'DD/MM/YYYY':
            return `${dd}/${mm}/${yyyy}`;
        case 'MM/DD/YYYY':
            return `${mm}/${dd}/${yyyy}`;
        default:
            return `${yyyy}-${mm}-${dd}`;
    }
}
/**
 * Builds a compare URL from base and head SHAs.
 */
function buildCompareUrl(repoUrl, baseSha, headSha) {
    if (!repoUrl || !baseSha || !headSha)
        return '';
    const base = repoUrl.replace(/\/$/, '');
    return `${base}/compare/${baseSha}...${headSha}`;
}
/**
 * Returns abbreviated SHA (first 7 chars).
 */
function shortSha(sha) {
    return sha ? sha.slice(0, 7) : '';
}
//# sourceMappingURL=dateFormatter.js.map