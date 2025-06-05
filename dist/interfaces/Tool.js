"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tool = void 0;
// ===============================
// ===============================
// SECTION | TOOL
// ===============================
/**
 * Abstract class representing a Tool interface.
 * Implementations should provide a way to execute a tool.
 */
class Tool {
    constructor(name, description, parameters, extraTokens = 0) {
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this._extraTokens = extraTokens;
    }
}
exports.Tool = Tool;
// ===============================
