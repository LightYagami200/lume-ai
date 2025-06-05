import { Tool } from '../interfaces/Tool';
/**
 * Tool for interpreting code on a safe sandbox environment.
 * Requires a E2B API key (set as E2B_API_KEY in environment variables).
 */
export declare class E2BCodeInterpreter extends Tool {
    private apiKey;
    constructor(apiKey?: string);
    get metadata(): {
        name: string;
        description: string;
        parameters: {
            name: string;
            type: string;
            description: string;
            required: boolean;
        }[];
    };
    get extraTokens(): number;
    /**
     * Executes a E2B Code Interpreter.
     * @param params - { code: string }
     * @returns A concise string summary of the top E2B Code Interpreter results for LLMs.
     */
    execute(params: {
        code: string;
    }): Promise<string>;
}
