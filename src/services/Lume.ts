// ===============================
// SECTION | IMPORTS
// ===============================
import { Custom } from '../genes/Custom'
import { LLM, History, VectorDB, Gene, Tool } from '../interfaces'
// ===============================

// ===============================
// SECTION | LUME
// ===============================
/**
 * The main service class for interacting with a Large Language Model (LLM) and managing conversation history.
 */
export class Lume {
  /**
   * The LLM instance used for generating responses.
   */
  private llm: LLM
  /**
   * Optional history manager for storing and retrieving conversation history.
   */
  private history: History | undefined

  /**
   * Optional vector database instance used for storing and retrieving embeddings.
   */
  private vectorDB: VectorDB | undefined

  /**
   * Optional gene instance used for generating responses.
   */
  private gene: Gene

  /**
   * Optional tools instance used for executing tools.
   */
  private tools: Tool[] = []

  /**
   * Constructs a new Lume service instance.
   * @param config - Configuration object containing the LLM instance and optional history manager.
   */
  constructor(config: {
    llm: LLM
    history?: History
    vectorDB?: VectorDB
    gene?: Gene
    tools?: Tool[]
  }) {
    this.llm = config.llm
    this.history = config.history
    this.vectorDB = config.vectorDB
    this.gene = config.gene || new Custom()
    this.tools = config.tools || []
  }

  /**
   * Sends a message to the LLM and returns its response. Optionally stores the message in history.
   * @param text - The user's input message.
   * @param options - Optional parameters including tags for categorizing the message.
   * @returns A promise that resolves to the LLM's response as a string.
   */
  async chat(text: string, options?: { tags?: string[] }) {
    if (this.history)
      this.history.addMessage(options?.tags || [], {
        role: 'user',
        content: text,
      })

    let results: string[] = []

    if (this.vectorDB) {
      const embedding = await this.llm.getEmbedding(text)

      await this.vectorDB.add(text, embedding, options?.tags || [])
      results = await this.vectorDB.search(text, embedding, options?.tags || [])
    }

    const history = await this.history?.getMessages(options?.tags || [])

    const llmResponse = await this.llm.getResponse(text, {
      history: history?.reverse().slice(0, this.gene.maxHistory).reverse(),
      tags: options?.tags,
      vectorMatches: results,
      tools: this.tools,
      llmOptions: {
        systemPrompt: this.gene.generateSystemPrompt({
          vectorMatches: results,
        }),
        model: this.gene.model,
        temperature: this.gene.temperature,
        maxTokens:
          (this.gene.maxTokens || 1000) +
          this.tools.reduce((acc, tool) => acc + tool.extraTokens, 0),
        topP: this.gene.topP,
      },
    })

    if (this.vectorDB) {
      const embedding = await this.llm.getEmbedding(llmResponse)
      await this.vectorDB.add(llmResponse, embedding, options?.tags || [])
    }

    return llmResponse
  }

  /**
   * Streams a response from the LLM as it is generated. Optionally stores the message in history and updates vectorDB.
   * @param text - The user's input message.
   * @param options - Optional parameters including tags for categorizing the message.
   * @returns An async generator yielding the LLM's response chunks as strings.
   */
  async *chatStream(text: string, options?: { tags?: string[] }) {
    if (this.history)
      await this.history.addMessage(options?.tags || [], {
        role: 'user',
        content: text,
      })

    let results: string[] = []

    if (this.tools.length > 0) {
      throw new Error('Tools are not supported for streaming responses.')
    }

    if (this.vectorDB) {
      const embedding = await this.llm.getEmbedding(text)
      await this.vectorDB.add(text, embedding, options?.tags || [])
      results = await this.vectorDB.search(text, embedding, options?.tags || [])
    }

    const history = await this.history?.getMessages(options?.tags || [])

    if (!this.llm.streamResponse) {
      throw new Error('LLM does not support streaming responses.')
    }

    let fullResponse = ''
    for await (const chunk of this.llm.streamResponse(text, {
      history: history?.reverse().slice(0, this.gene.maxHistory).reverse(),
      tags: options?.tags,
      vectorMatches: results,
      tools: this.tools,
      llmOptions: {
        systemPrompt: this.gene.generateSystemPrompt({
          vectorMatches: results,
        }),
        model: this.gene.model,
        temperature: this.gene.temperature,
        maxTokens:
          (this.gene.maxTokens || 1000) +
          this.tools.reduce((acc, tool) => acc + tool.extraTokens, 0),
        topP: this.gene.topP,
      },
    })) {
      fullResponse += chunk
      yield chunk
    }

    if (this.vectorDB && fullResponse) {
      const embedding = await this.llm.getEmbedding(fullResponse)
      await this.vectorDB.add(fullResponse, embedding, options?.tags || [])
    }
  }
}
// ===============================
