import { VectorDB } from '../interfaces';
/**
 * Qdrant is a VectorDB implementation using the Qdrant cloud vector database provider.
 */
export declare class Qdrant extends VectorDB {
    private client;
    private collectionName;
    /**
     * Creates a new Qdrant instance with the given API key and collection name.
     * @param opts - The configuration options for Qdrant.
     * @param opts.apiKey - The Qdrant API key.
     * @param opts.collectionName - The name of the Qdrant collection to use.
     * @param opts.url - The URL of the Qdrant server.
     */
    constructor(opts: {
        apiKey: string;
        collectionName: string;
        url: string;
    });
    /**
     * Adds a text and its vector representation to the Pinecone index, associating it with one or more tags.
     * @param text - The text to store.
     * @param vector - The vector representation of the text.
     * @param tags - An array of tags to associate with the text/vector.
     */
    add(text: string, vector: number[], tags: string[]): Promise<void>;
    /**
     * Searches for items in the Pinecone index that match the given vector and tags.
     * @param _text - The text to use for filtering or scoring (currently unused).
     * @param vector - The query vector.
     * @param tags - An array of tags to filter the search.
     * @returns An array of matching texts as strings.
     */
    search(_text: string, vector: number[], tags: string[], topK?: number): Promise<string[]>;
    /**
     * Deletes all items from the Pinecone index that match the given tags.
     * @param tags - An array of tags whose associated items should be deleted.
     */
    delete(tags: string[]): Promise<void>;
}
