import { Gene } from '../interfaces';
type Expertise = 'general' | 'technical' | 'business' | 'legal' | 'medical';
type MemoryLength = 'short' | 'medium' | 'long';
/**
 * A professional, reliable AI assistant gene with configurable expertise and formality.
 *
 * This gene allows configuration of name, expertise, formality, memory length, and model parameters.
 * It generates a system prompt reflecting a professional and knowledgeable assistant.
 */
export declare class Professional extends Gene {
    /**
     * The assistant's name.
     */
    private _name;
    /**
     * The assistant's area of expertise.
     */
    private _expertise;
    /**
     * Formality level (0 = casual, 10 = highly formal).
     */
    private _formality;
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
     * Creates a new Professional gene instance.
     * @param opts - Optional configuration for the assistant's professionalism and model.
     */
    constructor(opts?: {
        name?: string;
        expertise?: Expertise;
        formality?: number;
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
     * Generates a system prompt reflecting the assistant's professionalism and expertise.
     * @param opts - Options for prompt generation, including optional vector matches.
     * @returns The generated system prompt as a string.
     */
    generateSystemPrompt(opts: {
        vectorMatches?: string[];
    }): string;
}
export {};
