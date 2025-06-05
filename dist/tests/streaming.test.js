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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// ===============================
// SECTION | IMPORTS
// ===============================
require("dotenv/config");
const globals_1 = require("@jest/globals");
const index_1 = require("../index");
const llms_1 = require("../llms");
const genes_1 = require("../genes");
// ===============================
// ===============================
// SECTION | TESTS
// ===============================
(0, globals_1.describe)('Streaming Tests', () => {
    (0, globals_1.test)('should stream response from OpenAI', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const lume = new index_1.Lume({
            llm: new llms_1.OpenAI(process.env.OPENAI_API_KEY || ''),
            gene: new genes_1.Friendly(),
        });
        const chunks = [];
        try {
            for (var _d = true, _e = __asyncValues(lume.chatStream('Can you write a short paragraph about an adorable AI?')), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                chunks.push(chunk);
                process.stdout.write(chunk); // For visual feedback during test run
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const fullResponse = chunks.join('');
        console.log('Streamed Response: ', fullResponse);
        (0, globals_1.expect)(fullResponse).toBeDefined();
        (0, globals_1.expect)(fullResponse.length).toBeGreaterThan(0);
    }));
    (0, globals_1.test)('should stream response from Anthropic', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_2, _b, _c;
        const lume = new index_1.Lume({
            llm: new llms_1.Anthropic(process.env.ANTHROPIC_API_KEY || ''),
            gene: new genes_1.Friendly(),
        });
        const chunks = [];
        try {
            for (var _d = true, _e = __asyncValues(lume.chatStream('Can you write a short paragraph about an adorable AI?')), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                chunks.push(chunk);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        const fullResponse = chunks.join('');
        console.log('Streamed Response: ', fullResponse);
        (0, globals_1.expect)(fullResponse).toBeDefined();
        (0, globals_1.expect)(fullResponse.length).toBeGreaterThan(0);
    }));
});
// ===============================
