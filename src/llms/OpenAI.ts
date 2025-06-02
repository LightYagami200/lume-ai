// ===============================
// SECTION | IMPORTS
// ===============================
import { OpenAI as OpenAIProvider } from 'openai'
import { LLM, Message, Tool } from '../interfaces'
import {
  ChatCompletionMessageToolCall,
  ChatCompletionTool,
  ChatCompletionMessageParam,
} from 'openai/resources/chat'
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
      tools?: Tool[]
      llmOptions: {
        systemPrompt: string
        model?: string
        temperature?: number
        maxTokens?: number
        topP?: number
      }
      toolCallId?: string
      toolCall?: ChatCompletionMessageToolCall
      toolCallDepth?: number
      toolResult?: string
    }
  ): Promise<string> {
    const MAX_TOOL_CALL_DEPTH = 3
    const toolCallDepth = options.toolCallDepth || 0
    if (toolCallDepth > MAX_TOOL_CALL_DEPTH) {
      return 'Tool call recursion limit reached.'
    }

    const tools = this._parseAndValidateTools(options.tools)
    let response
    try {
      response = await this.llm.chat.completions.create({
        model: options.llmOptions.model || 'gpt-4o-mini',
        messages: this._buildMessages(text, options),
        tools: tools && tools.length > 0 ? tools : undefined,
        temperature: options.llmOptions.temperature || 0.5,
        max_tokens: options.llmOptions.maxTokens || 1000,
        top_p: options.llmOptions.topP || 1,
      })
    } catch (err) {
      return 'Error during chat completion.'
    }

    return this._handleToolCalls(response, options, text, toolCallDepth)
  }

  /**
   * Parses and validates tools, returning only valid ChatCompletionTool objects.
   */
  private _parseAndValidateTools(tools?: Tool[]): ChatCompletionTool[] {
    return (
      tools
        ?.map((tool) => {
          try {
            return this.parseTool(tool)
          } catch (err) {
            return undefined
          }
        })
        .filter((t): t is ChatCompletionTool => Boolean(t)) || []
    )
  }

  /**
   * Builds the messages array for the OpenAI API call.
   */
  private _buildMessages(
    text: string,
    options: {
      history?: Message[]
      llmOptions: { systemPrompt: string }
      toolCallId?: string
      toolCall?: ChatCompletionMessageToolCall
      toolResult?: string
    }
  ): ChatCompletionMessageParam[] {
    return [
      {
        role: 'system',
        content: options.llmOptions.systemPrompt,
      },
      ...(options.history || []),
      { role: 'user', content: text },
      ...((options.toolCallId && options.toolCall
        ? [
            {
              role: 'assistant',
              tool_calls: [options.toolCall],
            },
            {
              role: 'tool',
              content: options.toolResult,
              tool_call_id: options.toolCallId,
            },
          ]
        : []) as ChatCompletionMessageParam[]),
    ]
  }

  /**
   * Handles tool calls in the response, including execution and recursion.
   */
  private async _handleToolCalls(
    response: any,
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
      toolCall?: ChatCompletionMessageToolCall
      toolCallDepth?: number
      toolResult?: string
    },
    text: string,
    toolCallDepth: number
  ): Promise<string> {
    const toolCalls = response?.choices?.[0]?.message?.tool_calls
    if (Array.isArray(toolCalls) && toolCalls.length > 0) {
      for (const toolCall of toolCalls) {
        const tool = options.tools?.find(
          (t) => t?.metadata?.name === toolCall?.function?.name
        )
        if (!tool) {
          continue
        }
        let result
        try {
          result = await tool.execute(JSON.parse(toolCall.function.arguments))
        } catch (err) {
          result = `Tool execution failed: ${err}`
        }
        return this.getResponse(text, {
          ...options,
          toolCallId: toolCall.id,
          toolCall,
          toolCallDepth: toolCallDepth + 1,
          toolResult: result,
        })
      }
    }
    return (
      response?.choices?.[0]?.message?.content || 'No response from the model'
    )
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

  /**
   * Parses a tool into an object.
   * @param tool - The tool to parse.
   * @returns An object representing the tool compatible with the LLM.
   */
  parseTool(tool: Tool): ChatCompletionTool {
    const meta = tool.metadata
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
      type: 'function',
      function: {
        name: meta.name,
        description: meta.description,
        parameters: {
          type: 'object',
          properties,
          required,
          additionalProperties: false,
        },
      },
    }
  }
}
// ===============================
