// ===============================
// SECTION | IMPORTS
// ===============================
import AnthropicProvider from '@anthropic-ai/sdk'
import { LLM, Message } from '../interfaces'
import { VoyageAIClient } from 'voyageai'
// ===============================

// ===============================
// SECTION | Anthropic
// ===============================
/**
 * Implementation of the LLM interface for Anthropic's Claude models.
 * Handles message formatting and API interaction for Anthropic.
 */
export class Anthropic extends LLM {
  /**
   * The Anthropic SDK client instance.
   */
  protected llm: AnthropicProvider

  /**
   * The Voyage AI client instance.
   */
  private voyage: VoyageAIClient

  /**
   * Constructs a new Anthropic LLM instance.
   * @param apiKey - The API key for authenticating with Anthropic.
   */
  constructor(apiKey: string) {
    super()
    this.llm = new AnthropicProvider({ apiKey })
    this.voyage = new VoyageAIClient({ apiKey })
  }

  /**
   * Gets a response from the Anthropic Claude model based on the provided text and options.
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
      llmOptions: {
        systemPrompt: string
        model?: string
        temperature?: number
        maxTokens?: number
        topP?: number
      }
    }
  ) {
    const response = await this.llm.messages.create({
      model: options.llmOptions.model || 'claude-3-5-sonnet-latest',
      max_tokens: options.llmOptions.maxTokens || 1000,
      system: options.llmOptions.systemPrompt,
      messages: [...(options.history || []), { role: 'user', content: text }],
      temperature: options.llmOptions.temperature || 0.5,
      top_p: options.llmOptions.topP || 1,
    })

    return 'text' in response.content[0]
      ? response.content[0].text
      : 'No response from the model'
  }

  /**
   * Streams a response from the Anthropic Claude model based on the provided text and options.
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
      llmOptions: {
        systemPrompt: string
        model?: string
        temperature?: number
        maxTokens?: number
        topP?: number
      }
    }
  ) {
    const response = await this.llm.messages.create({
      model: options.llmOptions.model || 'claude-3-5-sonnet-latest',
      max_tokens: options.llmOptions.maxTokens || 1000,
      system: options.llmOptions.systemPrompt,
      messages: [...(options.history || []), { role: 'user', content: text }],
      temperature: options.llmOptions.temperature || 0.5,
      top_p: options.llmOptions.topP || 1,
      stream: true,
    })

    for await (const chunk of response) {
      yield (
        'delta' in chunk && 'text' in chunk.delta
          ? 'text' in chunk.delta
            ? chunk.delta.text
            : ''
          : 'text' in chunk
          ? chunk.text
          : ''
      ) as string
    }
  }

  /**
   * Gets an embedding from the Anthropic Claude model based on the provided text.
   * @param text - The input text to get an embedding for.
   * @returns A promise that resolves to the model's embedding as an array of numbers.
   */
  async getEmbedding(text: string) {
    const response = await this.voyage.embed({
      input: text,
      model: 'voyage-3',
    })

    return response.data?.[0]?.embedding || []
  }
}
// ===============================
