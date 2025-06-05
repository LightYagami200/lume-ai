import { Gene } from '../interfaces';
/**
 * A customizable Gene implementation for language model configuration.
 *
 * Allows setting custom system prompts and model parameters.
 */
export declare class Custom extends Gene {
    /**
     * The system prompt template, with a placeholder for vector matches.
     */
    private systemPrompt;
    /**
     * The model identifier or name.
     */
    private _model;
    /**
     * The maximum number of history turns to keep.
     */
    private _maxHistory;
    /**
     * The number of top results to consider (top-k sampling).
     */
    private _topK;
    /**
     * The temperature value for sampling randomness.
     */
    private _temperature;
    /**
     * The maximum number of tokens to generate.
     */
    private _maxTokens;
    /**
     * The top-p value for nucleus sampling.
     */
    private _topP;
    /**
     * Creates a new Custom gene instance.
     * @param opts - Optional configuration for the gene.
     */
    constructor(opts?: {
        systemPrompt?: string;
        model?: string;
        maxHistory?: number;
        topK?: number;
        temperature?: number;
        maxTokens?: number;
        topP?: number;
    });
    /**
     * The model identifier or name.
     */
    get model(): string | undefined;
    /**
     * The maximum number of history turns to keep.
     */
    get maxHistory(): number | undefined;
    /**
     * The number of top results to consider (top-k sampling).
     */
    get topK(): number | undefined;
    /**
     * The temperature value for sampling randomness.
     */
    get temperature(): number | undefined;
    /**
     * The maximum number of tokens to generate.
     */
    get maxTokens(): number | undefined;
    /**
     * The top-p value for nucleus sampling.
     */
    get topP(): number | undefined;
    /**
     * Generates a system prompt by replacing the $VECTOR_MATCHES placeholder with relevant information.
     * @param opts - Options for prompt generation, including optional vector matches.
     * @returns The generated system prompt as a string.
     */
    generateSystemPrompt(opts: {
        vectorMatches?: string[];
    }): string;
}
