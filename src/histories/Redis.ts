// ===============================
// SECTION | IMPORTS
// ===============================
import { History, Message } from '../interfaces'
import RedisProvider from 'ioredis'
// ===============================

// ===============================
// SECTION | Redis
// ===============================
/**
 * Redis-backed implementation of the History interface for persistent message storage.
 * Useful for scalable, distributed, or production environments.
 */
export class Redis extends History {
  /**
   * The Redis client instance used for storage operations.
   */
  private redis: RedisProvider

  /**
   * Constructs a new Redis history instance.
   * @param redisUrl - Optional Redis connection URL. If not provided, defaults to localhost.
   */
  constructor(redisUrl?: string) {
    super()
    this.redis = redisUrl ? new RedisProvider(redisUrl) : new RedisProvider()
  }

  /**
   * Adds a message to Redis under the specified tags.
   * @param tags - An array of tags to categorize the message.
   * @param message - The message to add.
   */
  async addMessage(tags: string[], message: Message) {
    for (const tag of tags) {
      await this.redis.lpush(tag, JSON.stringify(message))
    }
  }

  /**
   * Retrieves all messages associated with the specified tags from Redis.
   * @param tags - An array of tags to filter messages.
   * @returns An array of messages for the given tags.
   */
  async getMessages(tags: string[]) {
    const messages = await Promise.all(
      tags.map((tag) => this.redis.lrange(tag, 0, -1))
    )
    return messages.flat().map((message) => JSON.parse(message) as Message)
  }

  /**
   * Clears all messages associated with the specified tags from Redis.
   * @param tags - An array of tags to clear messages for.
   */
  async clear(tags: string[]) {
    await Promise.all(tags.map((tag) => this.redis.del(tag)))
  }
}
// ===============================
