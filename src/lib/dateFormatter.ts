// SPDX-License-Identifier: GPL-3.0
import { DateFormatType } from '../types.js';

/**
 * Formats an ISO date string according to the specified format.
 * Falls back to the original string if parsing fails.
 */
export function formatDate(isoDate: string, format: DateFormatType): string {
  if (!isoDate) return '';

  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;

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
    case 'MMMM D, YYYY': {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ];
      return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${yyyy}`;
    }
    default:
      return `${yyyy}-${mm}-${dd}`;
  }
}

/**
 * Builds a compare URL from base and head SHAs.
 */
export function buildCompareUrl(repoUrl: string, baseSha: string, headSha: string): string {
  if (!repoUrl || !baseSha || !headSha) return '';
  const base = repoUrl.replace(/\/$/, '');
  return `${base}/compare/${baseSha}...${headSha}`;
}

/**
 * Returns abbreviated SHA (first 7 chars).
 */
export function shortSha(sha: string): string {
  return sha ? sha.slice(0, 7) : '';
}
