import AnthropicProvider from '@anthropic-ai/sdk';
import { LLM, Message, Tool } from '../interfaces';
/**
 * Implementation of the LLM interface for Anthropic's Claude models.
 * Handles message formatting and API interaction for Anthropic.
 */
export declare class Anthropic extends LLM {
    /**
     * The Anthropic SDK client instance.
     */
    protected llm: AnthropicProvider;
    /**
     * The Voyage AI client instance.
     */
    private voyage;
    /**
     * Whether to log debug information.
     */
    private debug;
    /**
     * Constructs a new Anthropic LLM instance.
     * @param apiKey - The API key for authenticating with Anthropic.
     * @param debug - Optional flag to enable debug logging.
     */
    constructor(apiKey: string, debug?: boolean);
    private logDebug;
    /**
     * Gets a response from the Anthropic Claude model based on the provided text and options.
     * @param text - The user's input message.
     * @param options - Optional parameters including message history and tags for context.
     * @returns A promise that resolves to the model's response as a string.
     */
    getResponse(text: string, options: {
        history?: Message[];
        tags?: string[];
        vectorMatches?: string[];
        tools?: Tool[];
        llmOptions: {
            systemPrompt: string;
            model?: string;
            temperature?: number;
            maxTokens?: number;
            topP?: number;
        };
        toolCallId?: string;
        toolCall?: any;
        toolCallDepth?: number;
        toolResult?: string;
    }): Promise<string>;
    /**
     * Streams a response from the Anthropic Claude model based on the provided text and options.
     * @param text - The user's input message.
     * @param options - Optional parameters including message history and tags for context.
     * @returns A promise that resolves to the model's response as a string.
     */
    streamResponse(text: string, options: {
        history?: Message[];
        tags?: string[];
        vectorMatches?: string[];
        tools?: Tool[];
        llmOptions: {
            systemPrompt: string;
            model?: string;
            temperature?: number;
            maxTokens?: number;
            topP?: number;
        };
    }): AsyncGenerator<string, void, unknown>;
    /**
     * Gets an embedding from the Anthropic Claude model based on the provided text.
     * @param text - The input text to get an embedding for.
     * @returns A promise that resolves to the model's embedding as an array of numbers.
     */
    getEmbedding(text: string): Promise<number[]>;
    /**
     * Parses a tool into an object.
     * @param tool - The tool to parse.
     * @returns An object representing the tool compatible with the LLM.
     */
    parseTool(tool: Tool): AnthropicProvider.Messages.ToolUnion;
}
