"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Custom = void 0;
// ===============================
// SECTION | Imports
// ===============================
const interfaces_1 = require("../interfaces");
// ===============================
// ===============================
// SECTION | Custom
// ===============================
/**
 * A customizable Gene implementation for language model configuration.
 *
 * Allows setting custom system prompts and model parameters.
 */
class Custom extends interfaces_1.Gene {
    /**
     * Creates a new Custom gene instance.
     * @param opts - Optional configuration for the gene.
     */
    constructor(opts) {
        super();
        /**
         * The system prompt template, with a placeholder for vector matches.
         */
        this.systemPrompt = "You are a helpful assistant.\n\nHere is some information that may be relevant to the user's question:\n$VECTOR_MATCHES";
        /**
         * The maximum number of history turns to keep.
         */
        this._maxHistory = 5;
        /**
         * The number of top results to consider (top-k sampling).
         */
        this._topK = 5;
        /**
         * The temperature value for sampling randomness.
         */
        this._temperature = 0.5;
        /**
         * The maximum number of tokens to generate.
         */
        this._maxTokens = 1000;
        /**
         * The top-p value for nucleus sampling.
         */
        this._topP = 1;
        this.systemPrompt = (opts === null || opts === void 0 ? void 0 : opts.systemPrompt) || this.systemPrompt;
        this._model = opts === null || opts === void 0 ? void 0 : opts.model;
        this._maxHistory = (opts === null || opts === void 0 ? void 0 : opts.maxHistory) || this._maxHistory;
        this._topK = (opts === null || opts === void 0 ? void 0 : opts.topK) || this._topK;
        this._temperature = (opts === null || opts === void 0 ? void 0 : opts.temperature) || this._temperature;
    }
    /**
     * The model identifier or name.
     */
    get model() {
        return this._model;
    }
    /**
     * The maximum number of history turns to keep.
     */
    get maxHistory() {
        return this._maxHistory;
    }
    /**
     * The number of top results to consider (top-k sampling).
     */
    get topK() {
        return this._topK;
    }
    /**
     * The temperature value for sampling randomness.
     */
    get temperature() {
        return this._temperature;
    }
    /**
     * The maximum number of tokens to generate.
     */
    get maxTokens() {
        return this._maxTokens;
    }
    /**
     * The top-p value for nucleus sampling.
     */
    get topP() {
        return this._topP;
    }
    /**
     * Generates a system prompt by replacing the $VECTOR_MATCHES placeholder with relevant information.
     * @param opts - Options for prompt generation, including optional vector matches.
     * @returns The generated system prompt as a string.
     */
    generateSystemPrompt(opts) {
        var _a;
        return this.systemPrompt.replace('$VECTOR_MATCHES', ((_a = opts.vectorMatches) === null || _a === void 0 ? void 0 : _a.join('\n')) || 'No relevant information found.');
    }
}
exports.Custom = Custom;
// ===============================
