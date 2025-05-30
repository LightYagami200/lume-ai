// ===============================
// SECTION | IMPORTS
// ===============================
import { History, Message } from '../interfaces'
import Database from 'better-sqlite3'
// ===============================

// ===============================
// SECTION | SQLite
// ===============================
/**
 * SQLite-backed implementation of the History interface for persistent message storage.
 * Uses better-sqlite3 for fast, synchronous access.
 */
export class SQLite extends History {
  /**
   * The SQLite database instance used for storage operations.
   */
  private db: Database.Database

  /**
   * Constructs a new SQLite history instance.
   * @param dbPath - Optional path to the SQLite database file. Defaults to 'memory.db'.
   */
  constructor(dbPath: string = 'memory.db') {
    super()
    this.db = new Database(dbPath)
    this.db.pragma('journal_mode = WAL')
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tag TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL
      )
    `)
  }

  /**
   * Adds a message to SQLite under the specified tags.
   * @param tags - An array of tags to categorize the message.
   * @param message - The message to add.
   */
  async addMessage(tags: string[], message: Message) {
    const stmt = this.db.prepare(
      'INSERT INTO messages (tag, role, content) VALUES (?, ?, ?)'
    )
    for (const tag of tags) {
      stmt.run(tag, message.role, message.content)
    }
  }

  /**
   * Retrieves all messages associated with the specified tags from SQLite.
   * @param tags - An array of tags to filter messages.
   * @returns An array of messages for the given tags.
   */
  async getMessages(tags: string[]): Promise<Message[]> {
    if (tags.length === 0) return []
    const placeholders = tags.map(() => '?').join(',')
    const rows = this.db
      .prepare(
        `SELECT role, content FROM messages WHERE tag IN (${placeholders}) ORDER BY id ASC`
      )
      .all(...tags)
    return rows.map((row: any) => ({ role: row.role, content: row.content }))
  }

  /**
   * Clears all messages associated with the specified tags from SQLite.
   * @param tags - An array of tags to clear messages for.
   */
  async clear(tags: string[]) {
    if (tags.length === 0) return
    const placeholders = tags.map(() => '?').join(',')
    this.db
      .prepare(`DELETE FROM messages WHERE tag IN (${placeholders})`)
      .run(...tags)
  }
}
// ===============================
