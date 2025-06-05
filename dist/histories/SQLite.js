"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLite = void 0;
// ===============================
// SECTION | IMPORTS
// ===============================
const interfaces_1 = require("../interfaces");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
// ===============================
// ===============================
// SECTION | SQLite
// ===============================
/**
 * SQLite-backed implementation of the History interface for persistent message storage.
 * Uses better-sqlite3 for fast, synchronous access.
 */
class SQLite extends interfaces_1.History {
    /**
     * Constructs a new SQLite history instance.
     * @param dbPath - Optional path to the SQLite database file. Defaults to 'memory.db'.
     */
    constructor(dbPath = 'memory.db') {
        super();
        this.db = new better_sqlite3_1.default(dbPath);
        this.db.pragma('journal_mode = WAL');
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tag TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL
      )
    `);
    }
    /**
     * Adds a message to SQLite under the specified tags.
     * @param tags - An array of tags to categorize the message.
     * @param message - The message to add.
     */
    addMessage(tags, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const stmt = this.db.prepare('INSERT INTO messages (tag, role, content) VALUES (?, ?, ?)');
            for (const tag of tags) {
                stmt.run(tag, message.role, message.content);
            }
        });
    }
    /**
     * Retrieves all messages associated with the specified tags from SQLite.
     * @param tags - An array of tags to filter messages.
     * @returns An array of messages for the given tags.
     */
    getMessages(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tags.length === 0)
                return [];
            const placeholders = tags.map(() => '?').join(',');
            const rows = this.db
                .prepare(`SELECT role, content FROM messages WHERE tag IN (${placeholders}) ORDER BY id ASC`)
                .all(...tags);
            return rows.map((row) => ({ role: row.role, content: row.content }));
        });
    }
    /**
     * Clears all messages associated with the specified tags from SQLite.
     * @param tags - An array of tags to clear messages for.
     */
    clear(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tags.length === 0)
                return;
            const placeholders = tags.map(() => '?').join(',');
            this.db
                .prepare(`DELETE FROM messages WHERE tag IN (${placeholders})`)
                .run(...tags);
        });
    }
}
exports.SQLite = SQLite;
// ===============================
