// SPDX-License-Identifier: GPL-3.0
import { InsightsV1, RenderConfig, TemplateType } from './types.js';
import { renderExecutive } from './templates/executive.js';
import { renderTechnical } from './templates/technical.js';
import { renderMinimal } from './templates/minimal.js';

/**
 * Dispatches to the correct template renderer based on config.template.
 */
export function render(insights: InsightsV1, config: RenderConfig): string {
  const templateMap: Record<TemplateType, (i: InsightsV1, c: RenderConfig) => string> = {
    executive: renderExecutive,
    technical: renderTechnical,
    minimal: renderMinimal,
  };

  const fn = templateMap[config.template];
  return fn(insights, config);
}
