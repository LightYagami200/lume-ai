import { LLM, History, VectorDB, Gene, Tool } from '../interfaces';
/**
 * The main service class for interacting with a Large Language Model (LLM) and managing conversation history.
 */
export declare class Lume {
    /**
     * The LLM instance used for generating responses.
     */
    private llm;
    /**
     * Optional history manager for storing and retrieving conversation history.
     */
    private history;
    /**
     * Optional vector database instance used for storing and retrieving embeddings.
     */
    private vectorDB;
    /**
     * Optional gene instance used for generating responses.
     */
    private gene;
    /**
     * Optional tools instance used for executing tools.
     */
    private tools;
    /**
     * Constructs a new Lume service instance.
     * @param config - Configuration object containing the LLM instance and optional history manager.
     */
    constructor(config: {
        llm: LLM;
        history?: History;
        vectorDB?: VectorDB;
        gene?: Gene;
        tools?: Tool[];
    });
    /**
     * Sends a message to the LLM and returns its response. Optionally stores the message in history.
     * @param text - The user's input message.
     * @param options - Optional parameters including tags for categorizing the message.
     * @returns A promise that resolves to the LLM's response as a string.
     */
    chat(text: string, options?: {
        tags?: string[];
    }): Promise<string>;
    /**
     * Streams a response from the LLM as it is generated. Optionally stores the message in history and updates vectorDB.
     * @param text - The user's input message.
     * @param options - Optional parameters including tags for categorizing the message.
     * @returns An async generator yielding the LLM's response chunks as strings.
     */
    chatStream(text: string, options?: {
        tags?: string[];
    }): AsyncGenerator<string, void, unknown>;
}
