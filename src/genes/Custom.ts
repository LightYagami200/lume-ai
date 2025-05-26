// ===============================
// SECTION | Imports
// ===============================
import { Gene } from '../interfaces'
// ===============================

// ===============================
// SECTION | Custom
// ===============================
/**
 * A customizable Gene implementation for language model configuration.
 *
 * Allows setting custom system prompts and model parameters.
 */
export class Custom extends Gene {
  /**
   * The system prompt template, with a placeholder for vector matches.
   */
  private systemPrompt =
    "You are a helpful assistant.\n\nHere is some information that may be relevant to the user's question:\n$VECTOR_MATCHES"
  /**
   * The model identifier or name.
   */
  private _model: string | undefined
  /**
   * The maximum number of history turns to keep.
   */
  private _maxHistory = 5
  /**
   * The number of top results to consider (top-k sampling).
   */
  private _topK = 5
  /**
   * The temperature value for sampling randomness.
   */
  private _temperature = 0.5
  /**
   * The maximum number of tokens to generate.
   */
  private _maxTokens = 1000
  /**
   * The top-p value for nucleus sampling.
   */
  private _topP = 1

  /**
   * Creates a new Custom gene instance.
   * @param opts - Optional configuration for the gene.
   */
  constructor(opts?: {
    systemPrompt?: string
    model?: string
    maxHistory?: number
    topK?: number
    temperature?: number
    maxTokens?: number
    topP?: number
  }) {
    super()
    this.systemPrompt = opts?.systemPrompt || this.systemPrompt
    this._model = opts?.model
    this._maxHistory = opts?.maxHistory || this._maxHistory
    this._topK = opts?.topK || this._topK
    this._temperature = opts?.temperature || this._temperature
  }

  /**
   * The model identifier or name.
   */
  get model(): string | undefined {
    return this._model
  }

  /**
   * The maximum number of history turns to keep.
   */
  get maxHistory(): number | undefined {
    return this._maxHistory
  }

  /**
   * The number of top results to consider (top-k sampling).
   */
  get topK(): number | undefined {
    return this._topK
  }

  /**
   * The temperature value for sampling randomness.
   */
  get temperature(): number | undefined {
    return this._temperature
  }

  /**
   * The maximum number of tokens to generate.
   */
  get maxTokens(): number | undefined {
    return this._maxTokens
  }

  /**
   * The top-p value for nucleus sampling.
   */
  get topP(): number | undefined {
    return this._topP
  }

  /**
   * Generates a system prompt by replacing the $VECTOR_MATCHES placeholder with relevant information.
   * @param opts - Options for prompt generation, including optional vector matches.
   * @returns The generated system prompt as a string.
   */
  generateSystemPrompt(opts: { vectorMatches?: string[] }): string {
    return this.systemPrompt.replace(
      '$VECTOR_MATCHES',
      opts.vectorMatches?.join('\n') || 'No relevant information found.'
    )
  }
}
// ===============================
