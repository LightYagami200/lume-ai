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
exports.Lume = void 0;
// ===============================
// SECTION | IMPORTS
// ===============================
const Custom_1 = require("../genes/Custom");
// ===============================
// ===============================
// SECTION | LUME
// ===============================
/**
 * The main service class for interacting with a Large Language Model (LLM) and managing conversation history.
 */
class Lume {
    /**
     * Constructs a new Lume service instance.
     * @param config - Configuration object containing the LLM instance and optional history manager.
     */
    constructor(config) {
        /**
         * Optional tools instance used for executing tools.
         */
        this.tools = [];
        this.llm = config.llm;
        this.history = config.history;
        this.vectorDB = config.vectorDB;
        this.gene = config.gene || new Custom_1.Custom();
        this.tools = config.tools || [];
    }
    /**
     * Sends a message to the LLM and returns its response. Optionally stores the message in history.
     * @param text - The user's input message.
     * @param options - Optional parameters including tags for categorizing the message.
     * @returns A promise that resolves to the LLM's response as a string.
     */
    chat(text, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.history)
                this.history.addMessage((options === null || options === void 0 ? void 0 : options.tags) || [], {
                    role: 'user',
                    content: text,
                });
            let results = [];
            if (this.vectorDB) {
                const embedding = yield this.llm.getEmbedding(text);
                yield this.vectorDB.add(text, embedding, (options === null || options === void 0 ? void 0 : options.tags) || []);
                results = yield this.vectorDB.search(text, embedding, (options === null || options === void 0 ? void 0 : options.tags) || []);
            }
            const history = yield ((_a = this.history) === null || _a === void 0 ? void 0 : _a.getMessages((options === null || options === void 0 ? void 0 : options.tags) || []));
            const llmResponse = yield this.llm.getResponse(text, {
                history: history === null || history === void 0 ? void 0 : history.reverse().slice(0, this.gene.maxHistory).reverse(),
                tags: options === null || options === void 0 ? void 0 : options.tags,
                vectorMatches: results,
                tools: this.tools,
                llmOptions: {
                    systemPrompt: this.gene.generateSystemPrompt({
                        vectorMatches: results,
                    }),
                    model: this.gene.model,
                    temperature: this.gene.temperature,
                    maxTokens: (this.gene.maxTokens || 1000) +
                        this.tools.reduce((acc, tool) => acc + tool.extraTokens, 0),
                    topP: this.gene.topP,
                },
            });
            if (this.vectorDB) {
                const embedding = yield this.llm.getEmbedding(llmResponse);
                yield this.vectorDB.add(llmResponse, embedding, (options === null || options === void 0 ? void 0 : options.tags) || []);
            }
            return llmResponse;
        });
    }
    /**
     * Streams a response from the LLM as it is generated. Optionally stores the message in history and updates vectorDB.
     * @param text - The user's input message.
     * @param options - Optional parameters including tags for categorizing the message.
     * @returns An async generator yielding the LLM's response chunks as strings.
     */
    chatStream(text, options) {
        return __asyncGenerator(this, arguments, function* chatStream_1() {
            var _a, e_1, _b, _c;
            var _d;
            if (this.history)
                yield __await(this.history.addMessage((options === null || options === void 0 ? void 0 : options.tags) || [], {
                    role: 'user',
                    content: text,
                }));
            let results = [];
            if (this.tools.length > 0) {
                throw new Error('Tools are not supported for streaming responses.');
            }
            if (this.vectorDB) {
                const embedding = yield __await(this.llm.getEmbedding(text));
                yield __await(this.vectorDB.add(text, embedding, (options === null || options === void 0 ? void 0 : options.tags) || []));
                results = yield __await(this.vectorDB.search(text, embedding, (options === null || options === void 0 ? void 0 : options.tags) || []));
            }
            const history = yield __await(((_d = this.history) === null || _d === void 0 ? void 0 : _d.getMessages((options === null || options === void 0 ? void 0 : options.tags) || [])));
            if (!this.llm.streamResponse) {
                throw new Error('LLM does not support streaming responses.');
            }
            let fullResponse = '';
            try {
                for (var _e = true, _f = __asyncValues(this.llm.streamResponse(text, {
                    history: history === null || history === void 0 ? void 0 : history.reverse().slice(0, this.gene.maxHistory).reverse(),
                    tags: options === null || options === void 0 ? void 0 : options.tags,
                    vectorMatches: results,
                    tools: this.tools,
                    llmOptions: {
                        systemPrompt: this.gene.generateSystemPrompt({
                            vectorMatches: results,
                        }),
                        model: this.gene.model,
                        temperature: this.gene.temperature,
                        maxTokens: (this.gene.maxTokens || 1000) +
                            this.tools.reduce((acc, tool) => acc + tool.extraTokens, 0),
                        topP: this.gene.topP,
                    },
                })), _g; _g = yield __await(_f.next()), _a = _g.done, !_a; _e = true) {
                    _c = _g.value;
                    _e = false;
                    const chunk = _c;
                    fullResponse += chunk;
                    yield yield __await(chunk);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_e && !_a && (_b = _f.return)) yield __await(_b.call(_f));
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (this.vectorDB && fullResponse) {
                const embedding = yield __await(this.llm.getEmbedding(fullResponse));
                yield __await(this.vectorDB.add(fullResponse, embedding, (options === null || options === void 0 ? void 0 : options.tags) || []));
            }
        });
    }
}
exports.Lume = Lume;
// ===============================
