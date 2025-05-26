// ===============================
// SECTION | IMPORTS
// ===============================
import { Custom } from '../genes/Custom'
import { LLM, History, VectorDB, Gene } from '../interfaces'
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
   * Constructs a new Lume service instance.
   * @param config - Configuration object containing the LLM instance and optional history manager.
   */
  constructor(config: {
    llm: LLM
    history?: History
    vectorDB?: VectorDB
    gene?: Gene
  }) {
    this.llm = config.llm
    this.history = config.history
    this.vectorDB = config.vectorDB
    this.gene = config.gene || new Custom()
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
      llmOptions: {
        systemPrompt: this.gene.generateSystemPrompt({
          vectorMatches: results,
        }),
        model: this.gene.model,
        temperature: this.gene.temperature,
      },
    })

    if (this.vectorDB) {
      const embedding = await this.llm.getEmbedding(llmResponse)
      await this.vectorDB.add(llmResponse, embedding, options?.tags || [])
    }

    return llmResponse
  }
}
// ===============================
