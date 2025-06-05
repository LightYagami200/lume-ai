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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ===============================
// SECTION | IMPORTS
// ===============================
require("dotenv/config");
const globals_1 = require("@jest/globals");
const index_1 = require("../index");
const llms_1 = require("../llms");
const path_1 = __importDefault(require("path"));
const vector_dbs_1 = require("../vector-dbs");
// ===============================
// ===============================
// SECTION | TESTS
// ===============================
(0, globals_1.describe)('Vector DB Tests', () => {
    (0, globals_1.test)('should use Vectra as the vector database', () => __awaiter(void 0, void 0, void 0, function* () {
        const lume = new index_1.Lume({
            llm: new llms_1.OpenAI(process.env.OPENAI_API_KEY || ''),
            vectorDB: new vector_dbs_1.Vectra(path_1.default.join(__dirname, 'index')),
        });
        const response1 = yield lume.chat('Hello, my name is John', {
            tags: ['user-1'],
        });
        console.log('AI Response:', response1);
        (0, globals_1.expect)(response1).toBeDefined();
        const response2 = yield lume.chat('What is my name?', {
            tags: ['user-1'],
        });
        console.log('AI Response:', response2);
        (0, globals_1.expect)(response2).toContain('John');
    }));
    (0, globals_1.test)('should use Pinecone as the vector database', () => __awaiter(void 0, void 0, void 0, function* () {
        const lume = new index_1.Lume({
            llm: new llms_1.OpenAI(process.env.OPENAI_API_KEY || ''),
            vectorDB: new vector_dbs_1.Pinecone({
                apiKey: process.env.PINECONE_API_KEY || '',
                indexName: 'test',
                namespace: 'test-namespace',
            }),
        });
        const response1 = yield lume.chat('Hello, my name is John', {
            tags: ['user-1'],
        });
        console.log('AI Response:', response1);
        (0, globals_1.expect)(response1).toBeDefined();
        const response2 = yield lume.chat('What is my name?', {
            tags: ['user-1'],
        });
        console.log('AI Response:', response2);
        (0, globals_1.expect)(response2).toContain('John');
    }));
    (0, globals_1.test)('should use Qdrant as the vector database', () => __awaiter(void 0, void 0, void 0, function* () {
        const lume = new index_1.Lume({
            llm: new llms_1.OpenAI(process.env.OPENAI_API_KEY || ''),
            vectorDB: new vector_dbs_1.Qdrant({
                apiKey: process.env.QDRANT_API_KEY || '',
                collectionName: 'test',
                url: process.env.QDRANT_ENDPOINT || '',
            }),
        });
        const response1 = yield lume.chat('Hello, my name is John', {
            tags: ['user-1'],
        });
        console.log('AI Response:', response1);
        (0, globals_1.expect)(response1).toBeDefined();
        const response2 = yield lume.chat('What is my name?', {
            tags: ['user-1'],
        });
        console.log('AI Response:', response2);
        (0, globals_1.expect)(response2).toContain('John');
    }));
});
// ===============================
