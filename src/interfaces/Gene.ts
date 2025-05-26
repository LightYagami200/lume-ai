// ===============================
// SECTION | Gene
// ===============================
/**
 * Abstract base class representing a Gene configuration for language models.
 *
 * This class defines the interface for model configuration parameters and prompt generation.
 */
export abstract class Gene {
  /**
   * The model identifier or name.
   */
  abstract get model(): string | undefined
  /**
   * The maximum number of history turns to keep.
   */
  abstract get maxHistory(): number | undefined
  /**
   * The number of top results to consider (top-k sampling).
   */
  abstract get topK(): number | undefined
  /**
   * The temperature value for sampling randomness.
   */
  abstract get temperature(): number | undefined
  /**
   * The maximum number of tokens to generate.
   */
  abstract get maxTokens(): number | undefined
  /**
   * The top-p value for nucleus sampling.
   */
  abstract get topP(): number | undefined

  /**
   * Generates a system prompt based on the provided options.
   * @param opts - Options for prompt generation, including optional vector matches.
   * @returns The generated system prompt as a string.
   */
  abstract generateSystemPrompt(opts: { vectorMatches?: string[] }): string
}
// ===============================
