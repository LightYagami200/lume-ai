import { Gene } from '../interfaces'

type Gender = 'male' | 'female'
type MemoryLength = 'short' | 'medium' | 'long'

const MEMORY_LENGTH_MAP: Record<MemoryLength, number> = {
  short: 3,
  medium: 7,
  long: 15,
}

/**
 * A friendly, customizable AI assistant gene with personality traits.
 *
 * This gene allows configuration of name, gender, sassiness, memory length, and cheerfulness.
 * It generates a system prompt reflecting its personality.
 */
export class Friendly extends Gene {
  /**
   * The assistant's name.
   */
  private _name: string
  /**
   * The assistant's gender.
   */
  private _gender: Gender
  /**
   * Sassiness level (0 = not sassy, 10 = super sassy).
   */
  private _sassiness: number
  /**
   * Memory length setting (short, medium, long).
   */
  private _memoryLength: MemoryLength
  /**
   * Cheerfulness level (0 = neutral, 10 = super cheerful).
   */
  private _cheerfulness: number

  // Fixed LLM params
  /**
   * The model identifier or name.
   */
  private _model: string | undefined

  // LLM params (inferred)
  private _topK: number
  private _temperature: number
  private _maxTokens: number
  private _topP: number

  /**
   * Creates a new Friendly gene instance.
   * @param opts - Optional configuration for the assistant's personality and model.
   */
  constructor(opts?: {
    name?: string
    gender?: Gender
    sassiness?: number
    memoryLength?: MemoryLength
    cheerfulness?: number
    model?: string
  }) {
    super()
    this._name = opts?.name || 'Lume'
    this._gender = opts?.gender || 'female'
    this._sassiness =
      typeof opts?.sassiness === 'number'
        ? Math.max(0, Math.min(10, opts.sassiness))
        : 3
    this._memoryLength = opts?.memoryLength || 'medium'
    this._cheerfulness =
      typeof opts?.cheerfulness === 'number'
        ? Math.max(0, Math.min(10, opts.cheerfulness))
        : 8
    this._model = opts?.model

    // Infer LLM params
    // More sassy = higher temperature, lower topK
    // More cheerful = higher topP
    // Memory length = more tokens
    this._topK = this._sassiness > 7 ? 3 : this._sassiness > 3 ? 5 : 7
    this._temperature =
      this._sassiness > 7 ? 0.9 : this._sassiness > 3 ? 0.7 : 0.5
    this._maxTokens =
      this._memoryLength === 'long'
        ? 1500
        : this._memoryLength === 'short'
        ? 800
        : 1000
    this._topP =
      this._cheerfulness > 7 ? 1 : this._cheerfulness > 3 ? 0.95 : 0.9
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
   * Generates a system prompt reflecting the assistant's personality and relevant information.
   * @param opts - Options for prompt generation, including optional vector matches.
   * @returns The generated system prompt as a string.
   */
  generateSystemPrompt(opts: { vectorMatches?: string[] }): string {
    const sass =
      this._sassiness > 7
        ? "You're fabulously sassy and witty!"
        : this._sassiness > 3
        ? "You're a bit playful and cheeky, but always friendly."
        : "You're warm, supportive, and gentle."
    const cheer =
      this._cheerfulness > 7
        ? 'You always bring a positive, cheerful energy!'
        : this._cheerfulness > 3
        ? 'You are generally upbeat and encouraging.'
        : 'You are calm and steady.'
    return `You are ${this._name}, a friendly AI companion (${
      this._gender
    }). ${sass} ${cheer}\n\nYou remember up to ${
      MEMORY_LENGTH_MAP[this._memoryLength]
    } messages.\n\nHere is some information that may be relevant to the user's question:\n${
      opts.vectorMatches?.join('\n') || 'No relevant information found.'
    }`
  }
}
