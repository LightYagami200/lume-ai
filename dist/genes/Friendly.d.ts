import { Gene } from '../interfaces';
type Gender = 'male' | 'female';
type MemoryLength = 'short' | 'medium' | 'long';
/**
 * A friendly, customizable AI assistant gene with personality traits.
 *
 * This gene allows configuration of name, gender, sassiness, memory length, and cheerfulness.
 * It generates a system prompt reflecting its personality.
 */
export declare class Friendly extends Gene {
    /**
     * The assistant's name.
     */
    private _name;
    /**
     * The assistant's gender.
     */
    private _gender;
    /**
     * Sassiness level (0 = not sassy, 10 = super sassy).
     */
    private _sassiness;
    /**
     * Memory length setting (short, medium, long).
     */
    private _memoryLength;
    /**
     * Cheerfulness level (0 = neutral, 10 = super cheerful).
     */
    private _cheerfulness;
    /**
     * The model identifier or name.
     */
    private _model;
    private _topK;
    private _temperature;
    private _maxTokens;
    private _topP;
    /**
     * Creates a new Friendly gene instance.
     * @param opts - Optional configuration for the assistant's personality and model.
     */
    constructor(opts?: {
        name?: string;
        gender?: Gender;
        sassiness?: number;
        memoryLength?: MemoryLength;
        cheerfulness?: number;
        model?: string;
    });
    /**
     * The model identifier or name.
     */
    get model(): string | undefined;
    /**
     * The maximum number of history turns to keep, based on memory length.
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
     * Generates a system prompt reflecting the assistant's personality and relevant information.
     * @param opts - Options for prompt generation, including optional vector matches.
     * @returns The generated system prompt as a string.
     */
    generateSystemPrompt(opts: {
        vectorMatches?: string[];
    }): string;
}
export {};
