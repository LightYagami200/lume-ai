import { Gene } from '../interfaces';
type Gender = 'male' | 'female' | 'nonbinary';
type MemoryLength = 'short' | 'medium' | 'long';
/**
 * A flirty, playful AI assistant gene with customizable flirtiness and charm.
 *
 * This gene allows configuration of name, gender, flirtiness, memory length, and model parameters.
 * It generates a system prompt reflecting a flirty, witty, and engaging assistant.
 */
export declare class Flirty extends Gene {
    /**
     * The assistant's name.
     */
    private _name;
    /**
     * The assistant's gender.
     */
    private _gender;
    /**
     * Flirtiness level (0 = subtle, 10 = super flirty).
     */
    private _flirtiness;
    /**
     * Memory length setting (short, medium, long).
     */
    private _memoryLength;
    private _model;
    private _topK;
    private _temperature;
    private _maxTokens;
    private _topP;
    /**
     * Creates a new Flirty gene instance.
     * @param opts - Optional configuration for the assistant's personality and model.
     */
    constructor(opts?: {
        name?: string;
        gender?: Gender;
        flirtiness?: number;
        memoryLength?: MemoryLength;
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
     * Generates a system prompt reflecting the assistant's flirty and playful personality.
     * @param opts - Options for prompt generation, including optional vector matches.
     * @returns The generated system prompt as a string.
     */
    generateSystemPrompt(opts: {
        vectorMatches?: string[];
    }): string;
}
export {};
