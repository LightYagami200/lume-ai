import { GoogleGenAI } from '@google/genai';
import { LLM, Message, Tool } from '../interfaces';
/**
 * Implementation of the LLM interface for Google's Gemini models.
 * Handles message formatting and API interaction for Gemini.
 */
export declare class Gemini extends LLM {
    /**
     * The OpenAI SDK client instance.
     */
    protected llm: GoogleGenAI;
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
    }): Promise<string>;
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
    parseTool(tool: Tool): Object;
}
