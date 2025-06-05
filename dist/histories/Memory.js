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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
// ===============================
// SECTION | IMPORTS
// ===============================
const interfaces_1 = require("../interfaces");
// ===============================
// ===============================
// SECTION | Memory
// ===============================
/**
 * In-memory implementation of the History interface for storing messages locally.
 * Useful for development, testing, or ephemeral session storage.
 */
class Memory extends interfaces_1.History {
    /**
     * Constructs a new Memory history instance.
     */
    constructor() {
        super();
        /**
         * Internal storage for messages, organized by tag.
         */
        this.messages = {};
    }
    /**
     * Adds a message to the in-memory history under the specified tags.
     * @param tags - An array of tags to categorize the message.
     * @param message - The message to add.
     */
    addMessage(tags, message) {
        return __awaiter(this, void 0, void 0, function* () {
            tags.forEach((tag) => {
                if (!this.messages[tag])
                    this.messages[tag] = [];
                this.messages[tag].push(message);
            });
        });
    }
    /**
     * Retrieves all messages associated with the specified tags.
     * @param tags - An array of tags to filter messages.
     * @returns An array of messages for the given tags.
     */
    getMessages(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            return tags.map((tag) => this.messages[tag]).flat();
        });
    }
    /**
     * Clears all messages associated with the specified tags.
     * @param tags - An array of tags to clear messages for.
     */
    clear(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            tags.forEach((tag) => {
                this.messages[tag] = [];
            });
        });
    }
}
exports.Memory = Memory;
// ===============================
