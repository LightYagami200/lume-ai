// ===============================
// SECTION | IMPORTS
// ===============================
import { GoogleGenAI } from '@google/genai'
import { LLM, Message, Tool } from '../interfaces'
// ===============================

// ===============================
// SECTION | Gemini
// ===============================
/**
 * Implementation of the LLM interface for Google's Gemini models.
 * Handles message formatting and API interaction for Gemini.
 */
export class Gemini extends LLM {
  /**
   * The OpenAI SDK client instance.
   */
  protected llm: GoogleGenAI

  /**
   * Constructs a new OpenAI LLM instance.
   * @param apiKey - The API key for authenticating with OpenAI.
   */
  constructor(apiKey: string) {
    super()
    this.llm = new GoogleGenAI({
      apiKey,
    })
  }

  /**
   * Gets a response from the OpenAI GPT model based on the provided text and options.
   * @param text - The user's input message.
   * @param options - Optional parameters including message history and tags for context.
   * @returns A promise that resolves to the model's response as a string.
   */
  async getResponse(
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
    }
  ) {
    if (options.tools && options.tools.length > 0) {
      throw new Error('Gemini plugin does not support tools yet')
    }

    const response = await this.llm.models.generateContent({
      model: options.llmOptions.model || 'gemini-2.0-flash',
      config: {
        systemInstruction: options.llmOptions.systemPrompt,
        temperature: options.llmOptions.temperature || 0.5,
        maxOutputTokens: options.llmOptions.maxTokens || 1000,
        topP: options.llmOptions.topP || 1,
      },
      contents: [
        ...(options.history || []).map((message) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }],
        })),
        {
          role: 'user',
          parts: [{ text }],
        },
      ],
    })

    return response.text || 'No response from the model'
  }

  /**
   * Stream a response from the OpenAI GPT model based on the provided text and options.
   * @param text - The user's input message.
   * @param options - Optional parameters including message history and tags for context.
   * @returns A promise that resolves to the model's response as a string.
   */
  async *streamResponse(
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
    }
  ) {
    const response = await this.llm.models.generateContentStream({
      model: options.llmOptions.model || 'gemini-2.0-flash',
      config: {
        systemInstruction: options.llmOptions.systemPrompt,
        temperature: options.llmOptions.temperature || 0.5,
        maxOutputTokens: options.llmOptions.maxTokens || 1000,
        topP: options.llmOptions.topP || 1,
      },
      contents: [
        ...(options.history || []).map((message) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }],
        })),
        {
          role: 'user',
          parts: [{ text }],
        },
      ],
    })

    for await (const chunk of response) {
      yield chunk.text || ''
    }
  }

  /**
   * Gets an embedding from the OpenAI GPT model based on the provided text.
   * @param text - The input text to get an embedding for.
   * @returns A promise that resolves to the model's embedding as an array of numbers.
   */
  async getEmbedding(text: string) {
    const response = await this.llm.models.embedContent({
      model: 'gemini-embedding-exp-03-07',
      contents: text,
    })
    return response.embeddings?.[0]?.values || []
  }

  /**
   * Parses a tool into an object.
   * @param tool - The tool to parse.
   * @returns An object representing the tool compatible with the LLM.
   */
  parseTool(tool: Tool): Object {
    return {}
  }
}
// ===============================
