"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countWords = countWords;
// SPDX-License-Identifier: GPL-3.0
/**
 * Computes an approximate word count for a markdown string.
 * Strips markdown syntax characters, then counts whitespace-delimited tokens.
 */
function countWords(markdown) {
    if (!markdown)
        return 0;
    // Remove markdown formatting: headers, bold, italic, links, code, tables
    const stripped = markdown
        .replace(/```[\s\S]*?```/g, '') // fenced code blocks
        .replace(/`[^`]*`/g, '') // inline code
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
        .replace(/\[[^\]]*\]\([^)]*\)/g, '') // links – keep text
        .replace(/#{1,6}\s/g, '') // headers
        .replace(/[*_~`>|]/g, '') // misc markdown chars
        .replace(/^\s*[-+*]\s/gm, '') // list bullets
        .replace(/^\s*\d+\.\s/gm, '') // numbered lists
        .replace(/[-]{2,}/g, ' ') // horizontal rules
        .replace(/\s+/g, ' ')
        .trim();
    if (!stripped)
        return 0;
    return stripped.split(' ').filter((w) => w.length > 0).length;
}
//# sourceMappingURL=wordCount.js.map