import { History, Message } from '../interfaces';
/**
 * In-memory implementation of the History interface for storing messages locally.
 * Useful for development, testing, or ephemeral session storage.
 */
export declare class Memory extends History {
    /**
     * Internal storage for messages, organized by tag.
     */
    private messages;
    /**
     * Constructs a new Memory history instance.
     */
    constructor();
    /**
     * Adds a message to the in-memory history under the specified tags.
     * @param tags - An array of tags to categorize the message.
     * @param message - The message to add.
     */
    addMessage(tags: string[], message: Message): Promise<void>;
    /**
     * Retrieves all messages associated with the specified tags.
     * @param tags - An array of tags to filter messages.
     * @returns An array of messages for the given tags.
     */
    getMessages(tags: string[]): Promise<Message[]>;
    /**
     * Clears all messages associated with the specified tags.
     * @param tags - An array of tags to clear messages for.
     */
    clear(tags: string[]): Promise<void>;
}
