import { VectorDB } from '../interfaces';
/**
 * Pinecone is a VectorDB implementation using the Pinecone cloud vector database provider.
 */
export declare class Pinecone extends VectorDB {
    private pc;
    private index;
    private namespace;
    /**
     * Creates a new Pinecone instance with the given API key, index name, and namespace.
     * @param opts - The configuration options for Pinecone.
     * @param opts.apiKey - The Pinecone API key.
     * @param opts.indexName - The name of the Pinecone index to use.
     * @param opts.namespace - The namespace within the index to operate in.
     */
    constructor(opts: {
        apiKey: string;
        indexName: string;
        namespace: string;
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
