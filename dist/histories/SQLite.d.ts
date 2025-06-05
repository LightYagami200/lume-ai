import { History, Message } from '../interfaces';
/**
 * SQLite-backed implementation of the History interface for persistent message storage.
 * Uses better-sqlite3 for fast, synchronous access.
 */
export declare class SQLite extends History {
    /**
     * The SQLite database instance used for storage operations.
     */
    private db;
    /**
     * Constructs a new SQLite history instance.
     * @param dbPath - Optional path to the SQLite database file. Defaults to 'memory.db'.
     */
    constructor(dbPath?: string);
    /**
     * Adds a message to SQLite under the specified tags.
     * @param tags - An array of tags to categorize the message.
     * @param message - The message to add.
     */
    addMessage(tags: string[], message: Message): Promise<void>;
    /**
     * Retrieves all messages associated with the specified tags from SQLite.
     * @param tags - An array of tags to filter messages.
     * @returns An array of messages for the given tags.
     */
    getMessages(tags: string[]): Promise<Message[]>;
    /**
     * Clears all messages associated with the specified tags from SQLite.
     * @param tags - An array of tags to clear messages for.
     */
    clear(tags: string[]): Promise<void>;
}
