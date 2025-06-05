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
const tools_1 = require("../tools");
const llms_1 = require("../llms");
const Lume_1 = require("../services/Lume");
// ===============================
// ===============================
// SECTION | TESTS
// ===============================
(0, globals_1.describe)('Tools Tests', () => {
    (0, globals_1.test)('should work with BraveSearch', () => __awaiter(void 0, void 0, void 0, function* () {
        const lume = new Lume_1.Lume({
            llm: new llms_1.OpenAI(process.env.OPENAI_API_KEY || ''),
            tools: [new tools_1.BraveSearch(process.env.BRAVE_SEARCH_API_KEY || '')],
        });
        const response = yield lume.chat('What is the capital of France? search the web', {
            tags: ['test-tools-1'],
        });
        (0, globals_1.expect)(response).toContain('Paris');
    }));
    (0, globals_1.test)('should work with BraveSearch and Anthropic', () => __awaiter(void 0, void 0, void 0, function* () {
        const lume = new Lume_1.Lume({
            llm: new llms_1.Anthropic(process.env.ANTHROPIC_API_KEY || ''),
            tools: [new tools_1.BraveSearch(process.env.BRAVE_SEARCH_API_KEY || '')],
        });
        const response = yield lume.chat('What is the capital of France? search the web', {
            tags: ['test-tools-1'],
        });
        (0, globals_1.expect)(response).toContain('Paris');
    }));
    (0, globals_1.test)('should work with E2BCodeInterpreter', () => __awaiter(void 0, void 0, void 0, function* () {
        const lume = new Lume_1.Lume({
            llm: new llms_1.OpenAI(process.env.OPENAI_API_KEY || ''),
            tools: [new tools_1.E2BCodeInterpreter(process.env.E2B_API_KEY || '')],
        });
        const response = yield lume.chat('What is the square root of 16?', {
            tags: ['test-tools-1'],
        });
        (0, globals_1.expect)(response).toContain('4');
    }));
});
// ===============================
