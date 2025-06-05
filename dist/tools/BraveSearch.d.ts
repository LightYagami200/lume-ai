import { Tool } from '../interfaces/Tool';
/**
 * Tool for fetching web search results from the Brave Search API.
 * Requires a Brave Search API key (set as BRAVE_API_KEY in environment variables).
 */
export declare class BraveSearch extends Tool {
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
     * Executes a Brave Search query.
     * @param params - { query: string }
     * @returns A concise string summary of the top Brave Search results for LLMs.
     */
    execute(params: {
        query: string;
    }): Promise<string>;
}
