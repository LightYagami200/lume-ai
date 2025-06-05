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
(0, globals_1.describe)('Gene Tests', () => {
    (0, globals_1.test)('should use custom gene', () => __awaiter(void 0, void 0, void 0, function* () {
        const lume = new index_1.Lume({
            llm: new llms_1.OpenAI(process.env.OPENAI_API_KEY || ''),
            gene: new genes_1.Custom(),
        });
        const response = yield lume.chat('Hello, how are you?');
        console.log('AI Response:', response);
        (0, globals_1.expect)(response).toBeDefined();
    }));
    (0, globals_1.test)('should use friendly gene', () => __awaiter(void 0, void 0, void 0, function* () {
        const lume = new index_1.Lume({
            llm: new llms_1.OpenAI(process.env.OPENAI_API_KEY || ''),
            gene: new genes_1.Friendly(),
        });
        const response = yield lume.chat('Hello, how are you and what is your name?');
        console.log('AI Response:', response);
        (0, globals_1.expect)(response).toContain('Lume');
    }));
    (0, globals_1.test)('should use professional gene', () => __awaiter(void 0, void 0, void 0, function* () {
        const lume = new index_1.Lume({
            llm: new llms_1.OpenAI(process.env.OPENAI_API_KEY || ''),
            gene: new genes_1.Professional(),
        });
        const response = yield lume.chat('Hello, how are you and what is your name?');
        console.log('AI Response:', response);
        (0, globals_1.expect)(response).toContain('Lume');
    }));
    (0, globals_1.test)('should use flirty gene', () => __awaiter(void 0, void 0, void 0, function* () {
        const lume = new index_1.Lume({
            llm: new llms_1.OpenAI(process.env.OPENAI_API_KEY || ''),
            gene: new genes_1.Flirty(),
        });
        const response = yield lume.chat('Hello, how are you and what is your name?');
        console.log('AI Response:', response);
        (0, globals_1.expect)(response).toContain('Lume');
    }));
});
// ===============================
