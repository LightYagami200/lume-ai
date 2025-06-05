/**
 * Abstract base class representing a vector database interface.
 *
 * This class defines the contract for adding, searching, and deleting vectorized data.
 */
export declare abstract class VectorDB {
    /**
     * Adds a new entry to the vector database.
     * @param text - The original text to store.
     * @param vector - The vector representation of the text.
     * @param tags - Tags associated with the entry for filtering or identification.
     */
    abstract add(text: string, vector: number[], tags: string[]): Promise<void>;
    /**
     * Searches the vector database for entries similar to the provided text/vector.
     * @param text - The query text.
     * @param vector - The vector representation of the query text.
     * @param tags - Tags to filter the search.
     * @param topK - The maximum number of top results to return.
     * @returns A promise resolving to an array of matching texts.
     */
    abstract search(text: string, vector: number[], tags: string[], topK?: number): Promise<string[]>;
    /**
     * Deletes entries from the vector database matching the provided tags.
     * @param tags - Tags identifying which entries to delete.
     */
    abstract delete(tags: string[]): Promise<void>;
}
