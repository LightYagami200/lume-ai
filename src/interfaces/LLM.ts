// ===============================
// SECTION | IMPORTS
// ===============================
import { History, Message } from './History'
// ===============================

// ===============================
// SECTION | LLM
// ===============================
/**
 * Abstract class representing a Large Language Model (LLM) interface.
 * Implementations should provide a way to get responses from the LLM, optionally using message history.
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
      llmOptions: {
        systemPrompt: string
        model?: string
        temperature?: number
        maxTokens?: number
        topP?: number
      }
    }
  ): Promise<string>

  /**
   * Gets an embedding from the LLM based on the provided text.
   * @param text - The input text to get an embedding for.
   * @returns A promise that resolves to the LLM's embedding as an array of numbers.
   */
  abstract getEmbedding(text: string): Promise<number[]>
}
// ===============================
