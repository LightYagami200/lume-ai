// ===============================
// SECTION | IMPORTS
// ===============================
import AnthropicProvider from '@anthropic-ai/sdk'
import { LLM, Message, Tool } from '../interfaces'
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
   * Whether to log debug information.
   */
  private debug: boolean

  /**
   * Constructs a new Anthropic LLM instance.
   * @param apiKey - The API key for authenticating with Anthropic.
   * @param debug - Optional flag to enable debug logging.
   */
  constructor(apiKey: string, debug: boolean = false) {
    super()
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('Anthropic: apiKey must be a non-empty string')
    }
    this.llm = new AnthropicProvider({ apiKey })
    this.voyage = new VoyageAIClient({ apiKey })
    this.debug = debug
  }

  private logDebug(message: string, ...args: any[]) {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.debug(`[Anthropic DEBUG] ${message}`, ...args)
    }
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
  ): Promise<string> {
    if (!text || typeof text !== 'string') {
      throw new Error('Anthropic.getResponse: text must be a non-empty string')
    }
    if (!options || typeof options !== 'object') {
      throw new Error(
        'Anthropic.getResponse: options must be provided as an object'
      )
    }
    if (!options.llmOptions || typeof options.llmOptions !== 'object') {
      throw new Error('Anthropic.getResponse: llmOptions must be provided')
    }
    try {
      this.logDebug('Requesting response', { text, options })
      const response = await this.llm.messages.create({
        model: options.llmOptions.model || 'claude-3-5-sonnet-latest',
        max_tokens: options.llmOptions.maxTokens || 1000,
        system: options.llmOptions.systemPrompt,
        messages: [
          ...(options.history || []),
          { role: 'user', content: text },
          // --> Tool calls
          ...((options.toolCallId && options.toolCall
            ? [
                { role: 'assistant', content: options.toolCall },
                {
                  role: 'user',
                  content: [
                    {
                      tool_use_id: options.toolCallId,
                      content: options.toolResult,
                      type: 'tool_result',
                    },
                  ],
                },
              ]
            : []) as AnthropicProvider.Messages.MessageParam[]),
        ],
        temperature: options.llmOptions.temperature || 0.5,
        top_p: options.llmOptions.topP || 1,
        tools: options.tools?.map((tool) => this.parseTool(tool)),
      })
      this.logDebug('Received response', response)

      // Defensive: check response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Anthropic.getResponse: Invalid response from API')
      }

      // --> Process tools
      if (response.stop_reason === 'pause_turn') {
        this.logDebug('stop_reason: pause_turn, retrying...')
        return await this.getResponse(text, {
          ...options,
        })
      } else if (response.stop_reason === 'tool_use') {
        const toolCall = response.content
        if (!Array.isArray(toolCall)) {
          throw new Error('Anthropic.getResponse: toolCall is not an array')
        }
        const toolCallContent = toolCall.find((c) => c && c.type === 'tool_use')

        if (toolCallContent) {
          const tool = options.tools?.find(
            (t) => t?.metadata?.name === toolCallContent?.name
          )
          if (!tool) {
            this.logDebug('Tool not found for tool_call', toolCallContent)
            return 'Tool not found'
          }

          let result: any
          try {
            result = await tool.execute(toolCallContent.input as object)
          } catch (err) {
            this.logDebug('Error executing tool', err)
            return `Error executing tool: ${
              err instanceof Error ? err.message : String(err)
            }`
          }
          return await this.getResponse(text, {
            ...options,
            toolCallId: toolCallContent.id,
            toolCall,
            toolCallDepth: options.toolCallDepth || 0,
            toolResult: result,
          })
        }
      }

      // Defensive: check content structure
      if (!Array.isArray(response.content) || response.content.length === 0) {
        this.logDebug('No content in response')
        return 'No response from the model'
      }
      if ('text' in response.content[0]) {
        return response.content[0].text
      }
      this.logDebug('No text in response content')
      return 'No response from the model'
    } catch (err) {
      this.logDebug('Error in getResponse', err)
      return `Anthropic.getResponse error: ${
        err instanceof Error ? err.message : String(err)
      }`
    }
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
    if (!text || typeof text !== 'string') {
      throw new Error(
        'Anthropic.streamResponse: text must be a non-empty string'
      )
    }
    if (!options || typeof options !== 'object') {
      throw new Error(
        'Anthropic.streamResponse: options must be provided as an object'
      )
    }
    if (!options.llmOptions || typeof options.llmOptions !== 'object') {
      throw new Error('Anthropic.streamResponse: llmOptions must be provided')
    }
    try {
      this.logDebug('Requesting stream response', { text, options })
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
        if (chunk && typeof chunk === 'object') {
          if ('delta' in chunk && chunk.delta && 'text' in chunk.delta) {
            yield chunk.delta.text as string
          } else if ('text' in chunk) {
            yield chunk.text as string
          }
        }
      }
    } catch (err) {
      this.logDebug('Error in streamResponse', err)
      yield `Anthropic.streamResponse error: ${
        err instanceof Error ? err.message : String(err)
      }`
    }
  }

  /**
   * Gets an embedding from the Anthropic Claude model based on the provided text.
   * @param text - The input text to get an embedding for.
   * @returns A promise that resolves to the model's embedding as an array of numbers.
   */
  async getEmbedding(text: string) {
    if (!text || typeof text !== 'string') {
      throw new Error('Anthropic.getEmbedding: text must be a non-empty string')
    }
    try {
      this.logDebug('Requesting embedding', { text })
      const response = await this.voyage.embed({
        input: text,
        model: 'voyage-3',
      })
      if (
        !response ||
        typeof response !== 'object' ||
        !Array.isArray(response.data)
      ) {
        throw new Error(
          'Anthropic.getEmbedding: Invalid response from VoyageAI'
        )
      }
      return response.data?.[0]?.embedding || []
    } catch (err) {
      this.logDebug('Error in getEmbedding', err)
      return []
    }
  }

  /**
   * Parses a tool into an object.
   * @param tool - The tool to parse.
   * @returns An object representing the tool compatible with the LLM.
   */
  parseTool(tool: Tool): AnthropicProvider.Messages.ToolUnion {
    if (!tool || typeof tool !== 'object' || !tool.metadata) {
      throw new Error('Anthropic.parseTool: tool must be a valid Tool object')
    }
    const meta = tool.metadata
    if (!meta.name || !meta.parameters) {
      throw new Error(
        'Anthropic.parseTool: tool metadata must have name and parameters'
      )
    }
    const properties: Record<string, any> = {}
    const required: string[] = []
    for (const param of meta.parameters) {
      properties[param.name] = {
        type: param.type,
        description: param.description,
      }
      if (param.required) required.push(param.name)
    }
    return {
      name: meta.name,
      description: meta.description,
      input_schema: {
        type: 'object',
        properties,
        required,
      },
    }
  }
}
// ===============================
