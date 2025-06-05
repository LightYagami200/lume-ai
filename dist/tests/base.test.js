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
// ===============================
// ===============================
// SECTION | TESTS
// ===============================
(0, globals_1.describe)('Base Tests', () => {
    (0, globals_1.test)('should chat with the model', () => __awaiter(void 0, void 0, void 0, function* () {
        const lume = new index_1.Lume({ llm: new llms_1.OpenAI(process.env.OPENAI_API_KEY || '') });
        const response = yield lume.chat('Hello, how are you?');
        console.log('AI Response:', response);
        (0, globals_1.expect)(response).toBeDefined();
    }));
});
// ===============================
