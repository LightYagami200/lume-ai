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
exports.Redis = void 0;
// ===============================
// SECTION | IMPORTS
// ===============================
const interfaces_1 = require("../interfaces");
const ioredis_1 = __importDefault(require("ioredis"));
// ===============================
// ===============================
// SECTION | Redis
// ===============================
/**
 * Redis-backed implementation of the History interface for persistent message storage.
 * Useful for scalable, distributed, or production environments.
 */
class Redis extends interfaces_1.History {
    /**
     * Constructs a new Redis history instance.
     * @param redisUrl - Optional Redis connection URL. If not provided, defaults to localhost.
     */
    constructor(redisUrl) {
        super();
        this.redis = redisUrl ? new ioredis_1.default(redisUrl) : new ioredis_1.default();
    }
    /**
     * Adds a message to Redis under the specified tags.
     * @param tags - An array of tags to categorize the message.
     * @param message - The message to add.
     */
    addMessage(tags, message) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const tag of tags) {
                yield this.redis.lpush(tag, JSON.stringify(message));
            }
        });
    }
    /**
     * Retrieves all messages associated with the specified tags from Redis.
     * @param tags - An array of tags to filter messages.
     * @returns An array of messages for the given tags.
     */
    getMessages(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield Promise.all(tags.map((tag) => this.redis.lrange(tag, 0, -1)));
            return messages.flat().map((message) => JSON.parse(message));
        });
    }
    /**
     * Clears all messages associated with the specified tags from Redis.
     * @param tags - An array of tags to clear messages for.
     */
    clear(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(tags.map((tag) => this.redis.del(tag)));
        });
    }
}
exports.Redis = Redis;
// ===============================
