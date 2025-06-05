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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Anthropic = void 0;
// ===============================
// SECTION | IMPORTS
// ===============================
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const interfaces_1 = require("../interfaces");
const voyageai_1 = require("voyageai");
// ===============================
// ===============================
// SECTION | Anthropic
// ===============================
/**
 * Implementation of the LLM interface for Anthropic's Claude models.
 * Handles message formatting and API interaction for Anthropic.
 */
class Anthropic extends interfaces_1.LLM {
    /**
     * Constructs a new Anthropic LLM instance.
     * @param apiKey - The API key for authenticating with Anthropic.
     * @param debug - Optional flag to enable debug logging.
     */
    constructor(apiKey, debug = false) {
        super();
        if (!apiKey || typeof apiKey !== 'string') {
            throw new Error('Anthropic: apiKey must be a non-empty string');
        }
        this.llm = new sdk_1.default({ apiKey });
        this.voyage = new voyageai_1.VoyageAIClient({ apiKey });
        this.debug = debug;
    }
    logDebug(message, ...args) {
        if (this.debug) {
            // eslint-disable-next-line no-console
            console.debug(`[Anthropic DEBUG] ${message}`, ...args);
        }
    }
    /**
     * Gets a response from the Anthropic Claude model based on the provided text and options.
     * @param text - The user's input message.
     * @param options - Optional parameters including message history and tags for context.
     * @returns A promise that resolves to the model's response as a string.
     */
    getResponse(text, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!text || typeof text !== 'string') {
                throw new Error('Anthropic.getResponse: text must be a non-empty string');
            }
            if (!options || typeof options !== 'object') {
                throw new Error('Anthropic.getResponse: options must be provided as an object');
            }
            if (!options.llmOptions || typeof options.llmOptions !== 'object') {
                throw new Error('Anthropic.getResponse: llmOptions must be provided');
            }
            try {
                this.logDebug('Requesting response', { text, options });
                const response = yield this.llm.messages.create({
                    model: options.llmOptions.model || 'claude-3-5-sonnet-latest',
                    max_tokens: options.llmOptions.maxTokens || 1000,
                    system: options.llmOptions.systemPrompt,
                    messages: [
                        ...(options.history || []),
                        { role: 'user', content: text },
                        // --> Tool calls
                        ...(options.toolCallId && options.toolCall
                            ? [
                                { role: 'assistant', content: options.toolCall },
                                {
                                    role: 'user',
                                    content: [
                                        {
                                            tool_use_id: options.toolCallId,
                                            content: options.toolResult,
                                            type: 'tool_result',
                                        },
                                    ],
                                },
                            ]
                            : []),
                    ],
                    temperature: options.llmOptions.temperature || 0.5,
                    top_p: options.llmOptions.topP || 1,
                    tools: (_a = options.tools) === null || _a === void 0 ? void 0 : _a.map((tool) => this.parseTool(tool)),
                });
                this.logDebug('Received response', response);
                // Defensive: check response structure
                if (!response || typeof response !== 'object') {
                    throw new Error('Anthropic.getResponse: Invalid response from API');
                }
                // --> Process tools
                if (response.stop_reason === 'pause_turn') {
                    this.logDebug('stop_reason: pause_turn, retrying...');
                    return yield this.getResponse(text, Object.assign({}, options));
                }
                else if (response.stop_reason === 'tool_use') {
                    const toolCall = response.content;
                    if (!Array.isArray(toolCall)) {
                        throw new Error('Anthropic.getResponse: toolCall is not an array');
                    }
                    const toolCallContent = toolCall.find((c) => c && c.type === 'tool_use');
                    if (toolCallContent) {
                        const tool = (_b = options.tools) === null || _b === void 0 ? void 0 : _b.find((t) => { var _a; return ((_a = t === null || t === void 0 ? void 0 : t.metadata) === null || _a === void 0 ? void 0 : _a.name) === (toolCallContent === null || toolCallContent === void 0 ? void 0 : toolCallContent.name); });
                        if (!tool) {
                            this.logDebug('Tool not found for tool_call', toolCallContent);
                            return 'Tool not found';
                        }
                        let result;
                        try {
                            result = yield tool.execute(toolCallContent.input);
                        }
                        catch (err) {
                            this.logDebug('Error executing tool', err);
                            return `Error executing tool: ${err instanceof Error ? err.message : String(err)}`;
                        }
                        return yield this.getResponse(text, Object.assign(Object.assign({}, options), { toolCallId: toolCallContent.id, toolCall, toolCallDepth: options.toolCallDepth || 0, toolResult: result }));
                    }
                }
                // Defensive: check content structure
                if (!Array.isArray(response.content) || response.content.length === 0) {
                    this.logDebug('No content in response');
                    return 'No response from the model';
                }
                if ('text' in response.content[0]) {
                    return response.content[0].text;
                }
                this.logDebug('No text in response content');
                return 'No response from the model';
            }
            catch (err) {
                this.logDebug('Error in getResponse', err);
                return `Anthropic.getResponse error: ${err instanceof Error ? err.message : String(err)}`;
            }
        });
    }
    /**
     * Streams a response from the Anthropic Claude model based on the provided text and options.
     * @param text - The user's input message.
     * @param options - Optional parameters including message history and tags for context.
     * @returns A promise that resolves to the model's response as a string.
     */
    streamResponse(text, options) {
        return __asyncGenerator(this, arguments, function* streamResponse_1() {
            var _a, e_1, _b, _c;
            if (!text || typeof text !== 'string') {
                throw new Error('Anthropic.streamResponse: text must be a non-empty string');
            }
            if (!options || typeof options !== 'object') {
                throw new Error('Anthropic.streamResponse: options must be provided as an object');
            }
            if (!options.llmOptions || typeof options.llmOptions !== 'object') {
                throw new Error('Anthropic.streamResponse: llmOptions must be provided');
            }
            try {
                this.logDebug('Requesting stream response', { text, options });
                const response = yield __await(this.llm.messages.create({
                    model: options.llmOptions.model || 'claude-3-5-sonnet-latest',
                    max_tokens: options.llmOptions.maxTokens || 1000,
                    system: options.llmOptions.systemPrompt,
                    messages: [...(options.history || []), { role: 'user', content: text }],
                    temperature: options.llmOptions.temperature || 0.5,
                    top_p: options.llmOptions.topP || 1,
                    stream: true,
                }));
                try {
                    for (var _d = true, response_1 = __asyncValues(response), response_1_1; response_1_1 = yield __await(response_1.next()), _a = response_1_1.done, !_a; _d = true) {
                        _c = response_1_1.value;
                        _d = false;
                        const chunk = _c;
                        if (chunk && typeof chunk === 'object') {
                            if ('delta' in chunk && chunk.delta && 'text' in chunk.delta) {
                                yield yield __await(chunk.delta.text);
                            }
                            else if ('text' in chunk) {
                                yield yield __await(chunk.text);
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = response_1.return)) yield __await(_b.call(response_1));
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (err) {
                this.logDebug('Error in streamResponse', err);
                yield yield __await(`Anthropic.streamResponse error: ${err instanceof Error ? err.message : String(err)}`);
            }
        });
    }
    /**
     * Gets an embedding from the Anthropic Claude model based on the provided text.
     * @param text - The input text to get an embedding for.
     * @returns A promise that resolves to the model's embedding as an array of numbers.
     */
    getEmbedding(text) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!text || typeof text !== 'string') {
                throw new Error('Anthropic.getEmbedding: text must be a non-empty string');
            }
            try {
                this.logDebug('Requesting embedding', { text });
                const response = yield this.voyage.embed({
                    input: text,
                    model: 'voyage-3',
                });
                if (!response ||
                    typeof response !== 'object' ||
                    !Array.isArray(response.data)) {
                    throw new Error('Anthropic.getEmbedding: Invalid response from VoyageAI');
                }
                return ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.embedding) || [];
            }
            catch (err) {
                this.logDebug('Error in getEmbedding', err);
                return [];
            }
        });
    }
    /**
     * Parses a tool into an object.
     * @param tool - The tool to parse.
     * @returns An object representing the tool compatible with the LLM.
     */
    parseTool(tool) {
        if (!tool || typeof tool !== 'object' || !tool.metadata) {
            throw new Error('Anthropic.parseTool: tool must be a valid Tool object');
        }
        const meta = tool.metadata;
        if (!meta.name || !meta.parameters) {
            throw new Error('Anthropic.parseTool: tool metadata must have name and parameters');
        }
        const properties = {};
        const required = [];
        for (const param of meta.parameters) {
            properties[param.name] = {
                type: param.type,
                description: param.description,
            };
            if (param.required)
                required.push(param.name);
        }
        return {
            name: meta.name,
            description: meta.description,
            input_schema: {
                type: 'object',
                properties,
                required,
            },
        };
    }
}
exports.Anthropic = Anthropic;
// ===============================
