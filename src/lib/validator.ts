// SPDX-License-Identifier: GPL-3.0
import { InsightsV1, RenderConfig, VALID_TEMPLATES, VALID_DATE_FORMATS } from '../types.js';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates an insights.v1.json object against the expected schema.
 * Returns an array of validation errors (empty = valid).
 */
export function validateInsights(data: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    errors.push({ field: 'root', message: 'insights must be a JSON object' });
    return errors;
  }

  const obj = data as Record<string, unknown>;

  // Required string fields
  const requiredStrings: (keyof InsightsV1)[] = [
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
  const requiredArrays: (keyof InsightsV1)[] = [
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
export function validateConfig(config: RenderConfig): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!config.insightsPath) {
    errors.push({ field: 'insights_path', message: 'insights_path is required' });
  }

  if (!VALID_TEMPLATES.includes(config.template)) {
    errors.push({
      field: 'template',
      message: `template must be one of: ${VALID_TEMPLATES.join(', ')}`,
    });
  }

  if (!VALID_DATE_FORMATS.includes(config.dateFormat)) {
    errors.push({
      field: 'date_format',
      message: `date_format must be one of: ${VALID_DATE_FORMATS.join(', ')}`,
    });
  }

  if (!config.outputPath) {
    errors.push({ field: 'output_path', message: 'output_path must not be empty' });
  }

  return errors;
}
