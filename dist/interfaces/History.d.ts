/**
 * Represents a message exchanged between the user and the assistant.
 * @property role - The role of the message sender, either 'user' or 'assistant'.
 * @property content - The content of the message as a string.
 */
export interface Message {
    role: 'user' | 'assistant';
    content: string;
}
/**
 * Abstract class for managing message history.
 * Implementations should provide methods to add, retrieve, and clear messages based on tags.
 */
export declare abstract class History {
    /**
     * Adds a message to the history under the specified tags.
     * @param tags - An array of tags to categorize the message.
     * @param message - The message to add.
     */
    abstract addMessage(tags: string[], message: Message): Promise<void>;
    /**
     * Retrieves all messages associated with the specified tags.
     * @param tags - An array of tags to filter messages.
     * @returns A promise that resolves to an array of messages.
     */
    abstract getMessages(tags: string[]): Promise<Message[]>;
    /**
     * Clears all messages associated with the specified tags.
     * @param tags - An array of tags to clear messages for.
     */
    abstract clear(tags: string[]): Promise<void>;
}
