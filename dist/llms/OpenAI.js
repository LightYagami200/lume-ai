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
exports.OpenAI = void 0;
// ===============================
// SECTION | IMPORTS
// ===============================
const openai_1 = require("openai");
const interfaces_1 = require("../interfaces");
// ===============================
// ===============================
// SECTION | OpenAI
// ===============================
/**
 * Implementation of the LLM interface for OpenAI's GPT models.
 * Handles message formatting and API interaction for OpenAI.
 */
class OpenAI extends interfaces_1.LLM {
    /**
     * Constructs a new OpenAI LLM instance.
     * @param apiKey - The API key for authenticating with OpenAI.
     */
    constructor(apiKey) {
        super();
        this.llm = new openai_1.OpenAI({ apiKey });
    }
    /**
     * Gets a response from the OpenAI GPT model based on the provided text and options.
     * @param text - The user's input message.
     * @param options - Optional parameters including message history and tags for context.
     * @returns A promise that resolves to the model's response as a string.
     */
    getResponse(text, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const MAX_TOOL_CALL_DEPTH = 3;
            const toolCallDepth = options.toolCallDepth || 0;
            if (toolCallDepth > MAX_TOOL_CALL_DEPTH) {
                return 'Tool call recursion limit reached.';
            }
            const tools = this._parseAndValidateTools(options.tools);
            let response;
            try {
                response = yield this.llm.chat.completions.create({
                    model: options.llmOptions.model || 'gpt-4o-mini',
                    messages: this._buildMessages(text, options),
                    tools: tools && tools.length > 0 ? tools : undefined,
                    temperature: options.llmOptions.temperature || 0.5,
                    max_tokens: options.llmOptions.maxTokens || 1000,
                    top_p: options.llmOptions.topP || 1,
                });
            }
            catch (err) {
                return 'Error during chat completion.';
            }
            return this._handleToolCalls(response, options, text, toolCallDepth);
        });
    }
    /**
     * Parses and validates tools, returning only valid ChatCompletionTool objects.
     */
    _parseAndValidateTools(tools) {
        return ((tools === null || tools === void 0 ? void 0 : tools.map((tool) => {
            try {
                return this.parseTool(tool);
            }
            catch (err) {
                return undefined;
            }
        }).filter((t) => Boolean(t))) || []);
    }
    /**
     * Builds the messages array for the OpenAI API call.
     */
    _buildMessages(text, options) {
        return [
            {
                role: 'system',
                content: options.llmOptions.systemPrompt,
            },
            ...(options.history || []),
            { role: 'user', content: text },
            ...(options.toolCallId && options.toolCall
                ? [
                    {
                        role: 'assistant',
                        tool_calls: [options.toolCall],
                    },
                    {
                        role: 'tool',
                        content: options.toolResult,
                        tool_call_id: options.toolCallId,
                    },
                ]
                : []),
        ];
    }
    /**
     * Handles tool calls in the response, including execution and recursion.
     */
    _handleToolCalls(response, options, text, toolCallDepth) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const toolCalls = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.tool_calls;
            if (Array.isArray(toolCalls) && toolCalls.length > 0) {
                for (const toolCall of toolCalls) {
                    const tool = (_d = options.tools) === null || _d === void 0 ? void 0 : _d.find((t) => { var _a, _b; return ((_a = t === null || t === void 0 ? void 0 : t.metadata) === null || _a === void 0 ? void 0 : _a.name) === ((_b = toolCall === null || toolCall === void 0 ? void 0 : toolCall.function) === null || _b === void 0 ? void 0 : _b.name); });
                    if (!tool) {
                        continue;
                    }
                    let result;
                    try {
                        result = yield tool.execute(JSON.parse(toolCall.function.arguments));
                    }
                    catch (err) {
                        result = `Tool execution failed: ${err}`;
                    }
                    return this.getResponse(text, Object.assign(Object.assign({}, options), { toolCallId: toolCall.id, toolCall, toolCallDepth: toolCallDepth + 1, toolResult: result }));
                }
            }
            return (((_g = (_f = (_e = response === null || response === void 0 ? void 0 : response.choices) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.message) === null || _g === void 0 ? void 0 : _g.content) || 'No response from the model');
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
            const response = yield __await(this.llm.chat.completions.create({
                model: options.llmOptions.model || 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: options.llmOptions.systemPrompt,
                    },
                    ...(options.history || []),
                    { role: 'user', content: text },
                ],
                temperature: options.llmOptions.temperature || 0.5,
                max_tokens: options.llmOptions.maxTokens || 1000,
                top_p: options.llmOptions.topP || 1,
                stream: true,
            }));
            try {
                for (var _d = true, response_1 = __asyncValues(response), response_1_1; response_1_1 = yield __await(response_1.next()), _a = response_1_1.done, !_a; _d = true) {
                    _c = response_1_1.value;
                    _d = false;
                    const chunk = _c;
                    yield yield __await(chunk.choices[0].delta.content || '');
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
            const response = yield this.llm.embeddings.create({
                model: 'text-embedding-3-small',
                input: text,
            });
            return response.data[0].embedding;
        });
    }
    /**
     * Parses a tool into an object.
     * @param tool - The tool to parse.
     * @returns An object representing the tool compatible with the LLM.
     */
    parseTool(tool) {
        const meta = tool.metadata;
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
            type: 'function',
            function: {
                name: meta.name,
                description: meta.description,
                parameters: {
                    type: 'object',
                    properties,
                    required,
                    additionalProperties: false,
                },
            },
        };
    }
}
exports.OpenAI = OpenAI;
// ===============================
