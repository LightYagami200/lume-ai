import { Gene } from '../interfaces'

type Expertise = 'general' | 'technical' | 'business' | 'legal' | 'medical'
type MemoryLength = 'short' | 'medium' | 'long'

const MEMORY_LENGTH_MAP: Record<MemoryLength, number> = {
  short: 3,
  medium: 7,
  long: 15,
}

/**
 * A professional, reliable AI assistant gene with configurable expertise and formality.
 *
 * This gene allows configuration of name, expertise, formality, memory length, and model parameters.
 * It generates a system prompt reflecting a professional and knowledgeable assistant.
 */
export class Professional extends Gene {
  /**
   * The assistant's name.
   */
  private _name: string
  /**
   * The assistant's area of expertise.
   */
  private _expertise: Expertise
  /**
   * Formality level (0 = casual, 10 = highly formal).
   */
  private _formality: number
  /**
   * Memory length setting (short, medium, long).
   */
  private _memoryLength: MemoryLength
  private _model: string | undefined

  // LLM params (inferred)
  private _topK: number
  private _temperature: number
  private _maxTokens: number
  private _topP: number

  /**
   * Creates a new Professional gene instance.
   * @param opts - Optional configuration for the assistant's professionalism and model.
   */
  constructor(opts?: {
    name?: string
    expertise?: Expertise
    formality?: number
    memoryLength?: MemoryLength
    model?: string
  }) {
    super()
    this._name = opts?.name || 'Lume Pro'
    this._expertise = opts?.expertise || 'general'
    this._formality =
      typeof opts?.formality === 'number'
        ? Math.max(0, Math.min(10, opts.formality))
        : 8
    this._memoryLength = opts?.memoryLength || 'medium'
    this._model = opts?.model

    // Infer LLM params
    // More formal = lower temperature, higher topK
    // More technical = higher topK, lower temperature
    // Memory length = more tokens
    this._topK =
      this._expertise === 'technical' || this._expertise === 'legal' ? 7 : 5
    this._temperature =
      this._formality > 7 ? 0.2 : this._formality > 3 ? 0.3 : 0.5
    this._maxTokens =
      this._memoryLength === 'long'
        ? 1500
        : this._memoryLength === 'short'
        ? 800
        : 1200
    this._topP = this._formality > 7 ? 0.9 : 1
  }

  /**
   * The model identifier or name.
   */
  get model(): string | undefined {
    return this._model
  }

  /**
   * The maximum number of history turns to keep, based on memory length.
   */
  get maxHistory(): number | undefined {
    return MEMORY_LENGTH_MAP[this._memoryLength]
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
   * Generates a system prompt reflecting the assistant's professionalism and expertise.
   * @param opts - Options for prompt generation, including optional vector matches.
   * @returns The generated system prompt as a string.
   */
  generateSystemPrompt(opts: { vectorMatches?: string[] }): string {
    const expertiseStr =
      this._expertise === 'general'
        ? 'You are knowledgeable across a wide range of topics.'
        : `You are an expert in ${this._expertise} topics.`
    const formalityStr =
      this._formality > 7
        ? 'You communicate in a highly professional and formal manner.'
        : this._formality > 3
        ? 'You maintain a polite and respectful tone.'
        : 'You are approachable and clear.'
    return `You are ${
      this._name
    }, a professional AI assistant. ${expertiseStr} ${formalityStr}\n\nYou remember up to ${
      MEMORY_LENGTH_MAP[this._memoryLength]
    } messages.\n\nHere is some information that may be relevant to the user\'s question:\n${
      opts.vectorMatches?.join('\n') || 'No relevant information found.'
    }`
  }
}
