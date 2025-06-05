"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gemini = void 0;
// ===============================
// SECTION | IMPORTS
// ===============================
const genai_1 = require("@google/genai");
const interfaces_1 = require("../interfaces");
// ===============================
// ===============================
// SECTION | Gemini
// ===============================
/**
 * Implementation of the LLM interface for Google's Gemini models.
 * Handles message formatting and API interaction for Gemini.
 */
class Gemini extends interfaces_1.LLM {
    /**
     * Constructs a new OpenAI LLM instance.
     * @param apiKey - The API key for authenticating with OpenAI.
     */
    constructor(apiKey) {
        super();
        this.llm = new genai_1.GoogleGenAI({
            apiKey,
        });
    }
    /**
     * Gets a response from the OpenAI GPT model based on the provided text and options.
     * @param text - The user's input message.
     * @param options - Optional parameters including message history and tags for context.
     * @returns A promise that resolves to the model's response as a string.
     */
    getResponse(text, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.tools && options.tools.length > 0) {
                throw new Error('Gemini plugin does not support tools yet');
            }
            const response = yield this.llm.models.generateContent({
                model: options.llmOptions.model || 'gemini-2.0-flash',
                config: {
                    systemInstruction: options.llmOptions.systemPrompt,
                    temperature: options.llmOptions.temperature || 0.5,
                    maxOutputTokens: options.llmOptions.maxTokens || 1000,
                    topP: options.llmOptions.topP || 1,
                },
                contents: [
                    ...(options.history || []).map((message) => ({
                        role: message.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: message.content }],
                    })),
                    {
                        role: 'user',
                        parts: [{ text }],
                    },
                ],
            });
            return response.text || 'No response from the model';
        });
    }
    /**
     * Stream a response from the OpenAI GPT model based on the provided text and options.
     * @param text - The user's input message.
     * @param options - Optional parameters including message history and tags for context.
     * @returns A promise that resolves to the model's response as a string.
     */
    streamResponse(text, options) {
        return __asyncGenerator(this, arguments, function* streamResponse_1() {
            var _a, e_1, _b, _c;
            const response = yield __await(this.llm.models.generateContentStream({
                model: options.llmOptions.model || 'gemini-2.0-flash',
                config: {
                    systemInstruction: options.llmOptions.systemPrompt,
                    temperature: options.llmOptions.temperature || 0.5,
                    maxOutputTokens: options.llmOptions.maxTokens || 1000,
                    topP: options.llmOptions.topP || 1,
                },
                contents: [
                    ...(options.history || []).map((message) => ({
                        role: message.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: message.content }],
                    })),
                    {
                        role: 'user',
                        parts: [{ text }],
                    },
                ],
            }));
            try {
                for (var _d = true, response_1 = __asyncValues(response), response_1_1; response_1_1 = yield __await(response_1.next()), _a = response_1_1.done, !_a; _d = true) {
                    _c = response_1_1.value;
                    _d = false;
                    const chunk = _c;
                    yield yield __await(chunk.text || '');
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = response_1.return)) yield __await(_b.call(response_1));
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    /**
     * Gets an embedding from the OpenAI GPT model based on the provided text.
     * @param text - The input text to get an embedding for.
     * @returns A promise that resolves to the model's embedding as an array of numbers.
     */
    getEmbedding(text) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const response = yield this.llm.models.embedContent({
                model: 'gemini-embedding-exp-03-07',
                contents: text,
            });
            return ((_b = (_a = response.embeddings) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.values) || [];
        });
    }
    /**
     * Parses a tool into an object.
     * @param tool - The tool to parse.
     * @returns An object representing the tool compatible with the LLM.
     */
    parseTool(tool) {
        return {};
    }
}
exports.Gemini = Gemini;
// ===============================
