"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInsights = validateInsights;
exports.validateConfig = validateConfig;
// SPDX-License-Identifier: GPL-3.0
const types_js_1 = require("../types.js");
/**
 * Validates an insights.v1.json object against the expected schema.
 * Returns an array of validation errors (empty = valid).
 */
function validateInsights(data) {
    const errors = [];
    if (!data || typeof data !== 'object') {
        errors.push({ field: 'root', message: 'insights must be a JSON object' });
        return errors;
    }
    const obj = data;
    // Required string fields
    const requiredStrings = [
        'schema_version',
        'repo',
        'date_from',
        'date_to',
        'what_changed',
        'business_impact',
        'engineering_evolution',
    ];
    for (const field of requiredStrings) {
        if (!obj[field] || typeof obj[field] !== 'string') {
            errors.push({ field, message: `"${field}" must be a non-empty string` });
        }
    }
    // Required array fields
    const requiredArrays = [
        'highlights',
        'operational_risks',
        'mitigations',
        'notable_files',
    ];
    for (const field of requiredArrays) {
        if (!Array.isArray(obj[field])) {
            errors.push({ field, message: `"${field}" must be an array` });
        }
    }
    // schema_version must be v1
    if (obj['schema_version'] && !String(obj['schema_version']).startsWith('1')) {
        errors.push({
            field: 'schema_version',
            message: 'schema_version must start with "1" (this renderer supports v1)',
        });
    }
    return errors;
}
/**
 * Validates the render configuration.
 */
function validateConfig(config) {
    const errors = [];
    if (!config.insightsPath) {
        errors.push({ field: 'insights_path', message: 'insights_path is required' });
    }
    if (!types_js_1.VALID_TEMPLATES.includes(config.template)) {
        errors.push({
            field: 'template',
            message: `template must be one of: ${types_js_1.VALID_TEMPLATES.join(', ')}`,
        });
    }
    if (!types_js_1.VALID_DATE_FORMATS.includes(config.dateFormat)) {
        errors.push({
            field: 'date_format',
            message: `date_format must be one of: ${types_js_1.VALID_DATE_FORMATS.join(', ')}`,
        });
    }
    if (!config.outputPath) {
        errors.push({ field: 'output_path', message: 'output_path must not be empty' });
    }
    return errors;
}
//# sourceMappingURL=validator.js.map