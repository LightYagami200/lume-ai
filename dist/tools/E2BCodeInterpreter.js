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
exports.E2BCodeInterpreter = void 0;
const code_interpreter_1 = __importDefault(require("@e2b/code-interpreter"));
const Tool_1 = require("../interfaces/Tool");
/**
 * Tool for interpreting code on a safe sandbox environment.
 * Requires a E2B API key (set as E2B_API_KEY in environment variables).
 */
class E2BCodeInterpreter extends Tool_1.Tool {
    constructor(apiKey = process.env.E2B_API_KEY || '') {
        super('e2b-code-interpreter', 'Interprets code on a safe sandbox environment.', [
            {
                name: 'code',
                type: 'string',
                description: 'The code to interpret.',
                required: true,
            },
        ], 100);
        this.apiKey = apiKey;
        if (!this.apiKey) {
            throw new Error('E2BCodeInterpreter: Missing E2B_API_KEY!');
        }
    }
    get metadata() {
        return {
            name: this.name,
            description: this.description,
            parameters: this.parameters,
        };
    }
    get extraTokens() {
        return this._extraTokens;
    }
    /**
     * Executes a E2B Code Interpreter.
     * @param params - { code: string }
     * @returns A concise string summary of the top E2B Code Interpreter results for LLMs.
     */
    execute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = params;
            if (!code)
                throw new Error('E2BCodeInterpreter: Missing code parameter!');
            const sandbox = yield code_interpreter_1.default.create({
                apiKey: this.apiKey,
            });
            const result = yield sandbox.runCode(code);
            yield sandbox.kill();
            return result.text || 'No result';
        });
    }
}
exports.E2BCodeInterpreter = E2BCodeInterpreter;
