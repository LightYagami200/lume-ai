/**
 * Vectra is a VectorDB implementation using the vectra LocalIndex for local vector storage and retrieval.
 */
import { VectorDB } from '../interfaces';
export declare class Vectra extends VectorDB {
    private index;
    /**
     * Creates a new Vectra instance with a local index at the given path.
     * @param path - The file system path where the local index is stored.
     */
    constructor(path: string);
    /**
     * Adds a text and its vector representation to the index, associating it with one or more tags.
     * @param text - The text to store.
     * @param vector - The vector representation of the text.
     * @param tags - An array of tags to associate with the text/vector.
     */
    add(text: string, vector: number[], tags: string[]): Promise<void>;
    /**
     * Searches for items in the index that match the given vector and tags, optionally using the text for filtering.
     * @param text - The text to use for filtering or scoring (if supported).
     * @param vector - The query vector.
     * @param tags - An array of tags to filter the search.
     * @returns An array of matching texts as strings.
     */
    search(text: string, vector: number[], tags: string[], topK?: number): Promise<string[]>;
    /**
     * Deletes all items from the index that match the given tags.
     * @param tags - An array of tags whose associated items should be deleted.
     */
    delete(tags: string[]): Promise<void>;
}
