// ===============================
// SECTION | IMPORTS
// ===============================
import { OpenAI as OpenAIProvider } from 'openai'
import { LLM, Message } from '../interfaces'
// ===============================

// ===============================
// SECTION | OpenAI
// ===============================
/**
 * Implementation of the LLM interface for OpenAI's GPT models.
 * Handles message formatting and API interaction for OpenAI.
 */
export class OpenAI extends LLM {
  /**
   * The OpenAI SDK client instance.
   */
  protected llm: OpenAIProvider

  /**
   * Constructs a new OpenAI LLM instance.
   * @param apiKey - The API key for authenticating with OpenAI.
   */
  constructor(apiKey: string) {
    super()
    this.llm = new OpenAIProvider({ apiKey })
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
      llmOptions: {
        systemPrompt: string
        model?: string
        temperature?: number
        maxTokens?: number
        topP?: number
      }
    }
  ) {
    const response = await this.llm.chat.completions.create({
      model: options.llmOptions.model || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: options.llmOptions.systemPrompt,
        },
        ...(options.history || []),
        { role: 'user', content: text },
      ],
      temperature: options.llmOptions.temperature || 0.5,
      max_tokens: options.llmOptions.maxTokens || 1000,
      top_p: options.llmOptions.topP || 1,
    })
    return response.choices[0].message.content || 'No response from the model'
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
      llmOptions: {
        systemPrompt: string
        model?: string
        temperature?: number
        maxTokens?: number
        topP?: number
      }
    }
  ) {
    const response = await this.llm.chat.completions.create({
      model: options.llmOptions.model || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: options.llmOptions.systemPrompt,
        },
        ...(options.history || []),
        { role: 'user', content: text },
      ],
      temperature: options.llmOptions.temperature || 0.5,
      max_tokens: options.llmOptions.maxTokens || 1000,
      top_p: options.llmOptions.topP || 1,
      stream: true,
    })

    for await (const chunk of response) {
      yield chunk.choices[0].delta.content || ''
    }
  }

  /**
   * Gets an embedding from the OpenAI GPT model based on the provided text.
   * @param text - The input text to get an embedding for.
   * @returns A promise that resolves to the model's embedding as an array of numbers.
   */
  async getEmbedding(text: string) {
    const response = await this.llm.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    })
    return response.data[0].embedding
  }
}
// ===============================
