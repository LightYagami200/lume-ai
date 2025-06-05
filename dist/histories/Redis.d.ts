import { History, Message } from '../interfaces';
/**
 * Redis-backed implementation of the History interface for persistent message storage.
 * Useful for scalable, distributed, or production environments.
 */
export declare class Redis extends History {
    /**
     * The Redis client instance used for storage operations.
     */
    private redis;
    /**
     * Constructs a new Redis history instance.
     * @param redisUrl - Optional Redis connection URL. If not provided, defaults to localhost.
     */
    constructor(redisUrl?: string);
    /**
     * Adds a message to Redis under the specified tags.
     * @param tags - An array of tags to categorize the message.
     * @param message - The message to add.
     */
    addMessage(tags: string[], message: Message): Promise<void>;
    /**
     * Retrieves all messages associated with the specified tags from Redis.
     * @param tags - An array of tags to filter messages.
     * @returns An array of messages for the given tags.
     */
    getMessages(tags: string[]): Promise<Message[]>;
    /**
     * Clears all messages associated with the specified tags from Redis.
     * @param tags - An array of tags to clear messages for.
     */
    clear(tags: string[]): Promise<void>;
}
