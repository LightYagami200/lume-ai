// ===============================
// SECTION | IMPORTS
// ===============================
import { Message } from './History'
import { Tool } from './Tool'
// ===============================

// ===============================
// SECTION | LLM
// ===============================
/**
 * Abstract class representing a Large Language Model (LLM) interface.
 * Implementations should provide a way to get responses from the LLM
 */
export abstract class LLM {
  /**
   * The underlying LLM instance or client.
   */
  protected llm: any

  /**
   * Gets a response from the LLM based on the provided text and options.
   * @param text - The input text to send to the LLM.
   * @param options - Optional parameters including message history and tags for context.
   * @returns A promise that resolves to the LLM's response as a string.
   */
  abstract getResponse(
    text: string,
    options: {
      history?: Message[]
      tags?: string[]
      vectorMatches?: string[]
      tools?: Tool[]
      llmOptions: {
        systemPrompt: string
        model?: string
        temperature?: number
        maxTokens?: number
        topP?: number
      }
      toolCallId?: string
      toolCall?: any
      toolCallDepth?: number
    }
  ): Promise<string>

  /**
   * Streams a response from the LLM based on the provided text and options.
   * @param text - The input text to send to the LLM.
   * @param options - Optional parameters including message history and tags for context.
   * @returns A promise that resolves to the LLM's response as a string.
   */
  streamResponse?(
    text: string,
    options: {
      history?: Message[]
      tags?: string[]
      vectorMatches?: string[]
      tools?: Tool[]
      llmOptions: {
        systemPrompt: string
        model?: string
        temperature?: number
        maxTokens?: number
        topP?: number
      }
      toolCallId?: string
      toolCall?: any
      toolCallDepth?: number
      toolResult?: string
    }
  ): AsyncGenerator<string>

  /**
   * Gets an embedding from the LLM based on the provided text.
   * @param text - The input text to get an embedding for.
   * @returns A promise that resolves to the LLM's embedding as an array of numbers.
   */
  abstract getEmbedding(text: string): Promise<number[]>

  /**
   * Parses a tool into an object.
   * @param tool - The tool to parse.
   * @returns An object representing the tool compatible with the LLM.
   */
  parseTool?(tool: Tool): Object
}
// ===============================
