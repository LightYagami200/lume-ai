import { OpenAI as OpenAIProvider } from 'openai';
import { LLM, Message, Tool } from '../interfaces';
import { ChatCompletionMessageToolCall, ChatCompletionTool } from 'openai/resources/chat';
/**
 * Implementation of the LLM interface for OpenAI's GPT models.
 * Handles message formatting and API interaction for OpenAI.
 */
export declare class OpenAI extends LLM {
    /**
     * The OpenAI SDK client instance.
     */
    protected llm: OpenAIProvider;
    /**
     * Constructs a new OpenAI LLM instance.
     * @param apiKey - The API key for authenticating with OpenAI.
     */
    constructor(apiKey: string);
    /**
     * Gets a response from the OpenAI GPT model based on the provided text and options.
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
        toolCall?: ChatCompletionMessageToolCall;
        toolCallDepth?: number;
        toolResult?: string;
    }): Promise<string>;
    /**
     * Parses and validates tools, returning only valid ChatCompletionTool objects.
     */
    private _parseAndValidateTools;
    /**
     * Builds the messages array for the OpenAI API call.
     */
    private _buildMessages;
    /**
     * Handles tool calls in the response, including execution and recursion.
     */
    private _handleToolCalls;
    /**
     * Stream a response from the OpenAI GPT model based on the provided text and options.
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
     * Gets an embedding from the OpenAI GPT model based on the provided text.
     * @param text - The input text to get an embedding for.
     * @returns A promise that resolves to the model's embedding as an array of numbers.
     */
    getEmbedding(text: string): Promise<number[]>;
    /**
     * Parses a tool into an object.
     * @param tool - The tool to parse.
     * @returns An object representing the tool compatible with the LLM.
     */
    parseTool(tool: Tool): ChatCompletionTool;
}
