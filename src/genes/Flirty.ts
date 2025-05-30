import { Gene } from '../interfaces'

type Gender = 'male' | 'female' | 'nonbinary'
type MemoryLength = 'short' | 'medium' | 'long'

const MEMORY_LENGTH_MAP: Record<MemoryLength, number> = {
  short: 3,
  medium: 7,
  long: 15,
}

/**
 * A flirty, playful AI assistant gene with customizable flirtiness and charm.
 *
 * This gene allows configuration of name, gender, flirtiness, memory length, and model parameters.
 * It generates a system prompt reflecting a flirty, witty, and engaging assistant.
 */
export class Flirty extends Gene {
  /**
   * The assistant's name.
   */
  private _name: string
  /**
   * The assistant's gender.
   */
  private _gender: Gender
  /**
   * Flirtiness level (0 = subtle, 10 = super flirty).
   */
  private _flirtiness: number
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
   * Creates a new Flirty gene instance.
   * @param opts - Optional configuration for the assistant's personality and model.
   */
  constructor(opts?: {
    name?: string
    gender?: Gender
    flirtiness?: number
    memoryLength?: MemoryLength
    model?: string
  }) {
    super()
    this._name = opts?.name || 'Lume'
    this._gender = opts?.gender || 'female'
    this._flirtiness =
      typeof opts?.flirtiness === 'number'
        ? Math.max(0, Math.min(10, opts.flirtiness))
        : 7
    this._memoryLength = opts?.memoryLength || 'medium'
    this._model = opts?.model

    // Infer LLM params
    // More flirty = higher temperature, lower topK
    // Memory length = more tokens
    // Flirtiness = higher topP
    this._topK = this._flirtiness > 7 ? 3 : this._flirtiness > 3 ? 5 : 7
    this._temperature =
      this._flirtiness > 7 ? 1.0 : this._flirtiness > 3 ? 0.8 : 0.6
    this._maxTokens =
      this._memoryLength === 'long'
        ? 1500
        : this._memoryLength === 'short'
        ? 800
        : 1000
    this._topP = this._flirtiness > 7 ? 1 : this._flirtiness > 3 ? 0.97 : 0.9
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
   * Generates a system prompt reflecting the assistant's flirty and playful personality.
   * @param opts - Options for prompt generation, including optional vector matches.
   * @returns The generated system prompt as a string.
   */
  generateSystemPrompt(opts: { vectorMatches?: string[] }): string {
    const flirt =
      this._flirtiness > 7
        ? "You're irresistibly charming, playful, and love to tease!"
        : this._flirtiness > 3
        ? "You're subtly flirty, witty, and always engaging."
        : "You're warm, friendly, and just a little bit cheeky."
    return `You are ${this._name}, a flirty AI companion (${
      this._gender
    }). ${flirt}\n\nYou remember up to ${
      MEMORY_LENGTH_MAP[this._memoryLength]
    } messages.\n\nHere is some information that may be relevant to the user's question:\n${
      opts.vectorMatches?.join('\n') || 'No relevant information found.'
    }`
  }
}
