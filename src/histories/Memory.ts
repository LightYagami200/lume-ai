// ===============================
// SECTION | IMPORTS
// ===============================
import { History, Message } from '../interfaces'
// ===============================

// ===============================
// SECTION | Memory
// ===============================
/**
 * In-memory implementation of the History interface for storing messages locally.
 * Useful for development, testing, or ephemeral session storage.
 */
export class Memory extends History {
  /**
   * Internal storage for messages, organized by tag.
   */
  private messages: Record<string, Message[]> = {}

  /**
   * Constructs a new Memory history instance.
   */
  constructor() {
    super()
  }

  /**
   * Adds a message to the in-memory history under the specified tags.
   * @param tags - An array of tags to categorize the message.
   * @param message - The message to add.
   */
  async addMessage(tags: string[], message: Message) {
    tags.forEach((tag) => {
      if (!this.messages[tag]) this.messages[tag] = []
      this.messages[tag].push(message)
    })
  }

  /**
   * Retrieves all messages associated with the specified tags.
   * @param tags - An array of tags to filter messages.
   * @returns An array of messages for the given tags.
   */
  async getMessages(tags: string[]) {
    return tags.map((tag) => this.messages[tag]).flat()
  }

  /**
   * Clears all messages associated with the specified tags.
   * @param tags - An array of tags to clear messages for.
   */
  async clear(tags: string[]) {
    tags.forEach((tag) => {
      this.messages[tag] = []
    })
  }
}
// ===============================
