"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = render;
const executive_js_1 = require("./templates/executive.js");
const technical_js_1 = require("./templates/technical.js");
const minimal_js_1 = require("./templates/minimal.js");
/**
 * Dispatches to the correct template renderer based on config.template.
 */
function render(insights, config) {
    const templateMap = {
        executive: executive_js_1.renderExecutive,
        technical: technical_js_1.renderTechnical,
        minimal: minimal_js_1.renderMinimal,
    };
    const fn = templateMap[config.template];
    return fn(insights, config);
}
//# sourceMappingURL=renderer.js.map