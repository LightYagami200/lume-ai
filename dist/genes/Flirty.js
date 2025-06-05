"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flirty = void 0;
const interfaces_1 = require("../interfaces");
const MEMORY_LENGTH_MAP = {
    short: 3,
    medium: 7,
    long: 15,
};
/**
 * A flirty, playful AI assistant gene with customizable flirtiness and charm.
 *
 * This gene allows configuration of name, gender, flirtiness, memory length, and model parameters.
 * It generates a system prompt reflecting a flirty, witty, and engaging assistant.
 */
class Flirty extends interfaces_1.Gene {
    /**
     * Creates a new Flirty gene instance.
     * @param opts - Optional configuration for the assistant's personality and model.
     */
    constructor(opts) {
        super();
        this._name = (opts === null || opts === void 0 ? void 0 : opts.name) || 'Lume';
        this._gender = (opts === null || opts === void 0 ? void 0 : opts.gender) || 'female';
        this._flirtiness =
            typeof (opts === null || opts === void 0 ? void 0 : opts.flirtiness) === 'number'
                ? Math.max(0, Math.min(10, opts.flirtiness))
                : 7;
        this._memoryLength = (opts === null || opts === void 0 ? void 0 : opts.memoryLength) || 'medium';
        this._model = opts === null || opts === void 0 ? void 0 : opts.model;
        // Infer LLM params
        // More flirty = higher temperature, lower topK
        // Memory length = more tokens
        // Flirtiness = higher topP
        this._topK = this._flirtiness > 7 ? 3 : this._flirtiness > 3 ? 5 : 7;
        this._temperature =
            this._flirtiness > 7 ? 1.0 : this._flirtiness > 3 ? 0.8 : 0.6;
        this._maxTokens =
            this._memoryLength === 'long'
                ? 1500
                : this._memoryLength === 'short'
                    ? 800
                    : 1000;
        this._topP = this._flirtiness > 7 ? 1 : this._flirtiness > 3 ? 0.97 : 0.9;
    }
    /**
     * The model identifier or name.
     */
    get model() {
        return this._model;
    }
    /**
     * The maximum number of history turns to keep, based on memory length.
     */
    get maxHistory() {
        return MEMORY_LENGTH_MAP[this._memoryLength];
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
     * Generates a system prompt reflecting the assistant's flirty and playful personality.
     * @param opts - Options for prompt generation, including optional vector matches.
     * @returns The generated system prompt as a string.
     */
    generateSystemPrompt(opts) {
        var _a;
        const flirt = this._flirtiness > 7
            ? "You're irresistibly charming, playful, and love to tease!"
            : this._flirtiness > 3
                ? "You're subtly flirty, witty, and always engaging."
                : "You're warm, friendly, and just a little bit cheeky.";
        return `You are ${this._name}, a flirty AI companion (${this._gender}). ${flirt}\n\nYou remember up to ${MEMORY_LENGTH_MAP[this._memoryLength]} messages.\n\nHere is some information that may be relevant to the user's question:\n${((_a = opts.vectorMatches) === null || _a === void 0 ? void 0 : _a.join('\n')) || 'No relevant information found.'}`;
    }
}
exports.Flirty = Flirty;
