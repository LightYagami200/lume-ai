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
exports.Pinecone = void 0;
// ===============================
// SECTION | IMPORTS
// ===============================
const interfaces_1 = require("../interfaces");
const pinecone_1 = require("@pinecone-database/pinecone");
// ===============================
// ===============================
// SECTION | Pinecone
// ===============================
/**
 * Pinecone is a VectorDB implementation using the Pinecone cloud vector database provider.
 */
class Pinecone extends interfaces_1.VectorDB {
    /**
     * Creates a new Pinecone instance with the given API key, index name, and namespace.
     * @param opts - The configuration options for Pinecone.
     * @param opts.apiKey - The Pinecone API key.
     * @param opts.indexName - The name of the Pinecone index to use.
     * @param opts.namespace - The namespace within the index to operate in.
     */
    constructor(opts) {
        super();
        this.pc = new pinecone_1.Pinecone({ apiKey: opts.apiKey });
        this.index = this.pc.Index(opts.indexName);
        this.namespace = opts.namespace;
    }
    /**
     * Adds a text and its vector representation to the Pinecone index, associating it with one or more tags.
     * @param text - The text to store.
     * @param vector - The vector representation of the text.
     * @param tags - An array of tags to associate with the text/vector.
     */
    add(text, vector, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const tag of tags) {
                yield this.index.namespace(this.namespace).upsert([
                    {
                        id: `mem_${Date.now()}`,
                        values: vector,
                        metadata: {
                            text,
                            tag,
                        },
                    },
                ]);
            }
        });
    }
    /**
     * Searches for items in the Pinecone index that match the given vector and tags.
     * @param _text - The text to use for filtering or scoring (currently unused).
     * @param vector - The query vector.
     * @param tags - An array of tags to filter the search.
     * @returns An array of matching texts as strings.
     */
    search(_text, vector, tags, topK) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = [];
            for (const tag of tags) {
                const item = yield this.index.namespace(this.namespace).query({
                    vector,
                    topK: topK || 3,
                    includeMetadata: true,
                    filter: {
                        tag,
                    },
                });
                items.push(...item.matches);
            }
            return items.map((item) => { var _a; return String((_a = item.metadata) === null || _a === void 0 ? void 0 : _a.text); });
        });
    }
    /**
     * Deletes all items from the Pinecone index that match the given tags.
     * @param tags - An array of tags whose associated items should be deleted.
     */
    delete(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const tag of tags) {
                yield this.index.namespace(this.namespace).deleteMany({
                    filter: {
                        tag,
                    },
                });
            }
        });
    }
}
exports.Pinecone = Pinecone;
// ===============================
