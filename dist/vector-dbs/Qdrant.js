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
exports.Qdrant = void 0;
// ===============================
// SECTION | IMPORTS
// ===============================
const uuid_1 = require("uuid");
const interfaces_1 = require("../interfaces");
const js_client_rest_1 = require("@qdrant/js-client-rest");
// ===============================
// ===============================
// SECTION | Qdrant
// ===============================
/**
 * Qdrant is a VectorDB implementation using the Qdrant cloud vector database provider.
 */
class Qdrant extends interfaces_1.VectorDB {
    /**
     * Creates a new Qdrant instance with the given API key and collection name.
     * @param opts - The configuration options for Qdrant.
     * @param opts.apiKey - The Qdrant API key.
     * @param opts.collectionName - The name of the Qdrant collection to use.
     * @param opts.url - The URL of the Qdrant server.
     */
    constructor(opts) {
        super();
        this.client = new js_client_rest_1.QdrantClient({ apiKey: opts.apiKey, url: opts.url });
        this.collectionName = opts.collectionName;
    }
    /**
     * Adds a text and its vector representation to the Pinecone index, associating it with one or more tags.
     * @param text - The text to store.
     * @param vector - The vector representation of the text.
     * @param tags - An array of tags to associate with the text/vector.
     */
    add(text, vector, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.client.getCollection(this.collectionName);
            if (!collection) {
                yield this.client.createCollection(this.collectionName, {
                    vectors: {
                        size: vector.length,
                        distance: 'Cosine',
                    },
                });
            }
            // -> Create payload index
            const payloadIndexes = collection.payload_schema['tag'];
            if (!payloadIndexes) {
                yield this.client.createPayloadIndex(this.collectionName, {
                    field_name: 'tag',
                    field_schema: 'keyword',
                    wait: true,
                });
                yield this.client.createPayloadIndex(this.collectionName, {
                    field_name: 'text',
                    field_schema: 'text',
                    wait: true,
                });
            }
            for (const tag of tags) {
                yield this.client.upsert(this.collectionName, {
                    wait: true,
                    points: [
                        {
                            id: (0, uuid_1.v4)(),
                            vector,
                            payload: {
                                text,
                                tag,
                            },
                        },
                    ],
                });
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
                try {
                    const item = yield this.client.search(this.collectionName, {
                        vector,
                        limit: topK || 3,
                        filter: {
                            must: [
                                {
                                    key: 'tag',
                                    match: {
                                        value: tag,
                                    },
                                },
                            ],
                        },
                    });
                    items.push(...item);
                }
                catch (e) {
                    console.error(e);
                }
            }
            return items.map((item) => { var _a; return String((_a = item.payload) === null || _a === void 0 ? void 0 : _a.text); });
        });
    }
    /**
     * Deletes all items from the Pinecone index that match the given tags.
     * @param tags - An array of tags whose associated items should be deleted.
     */
    delete(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const tag of tags) {
                yield this.client.delete(this.collectionName, {
                    wait: true,
                    filter: {
                        must: [
                            {
                                key: 'tag',
                                match: {
                                    value: tag,
                                },
                            },
                        ],
                    },
                });
            }
        });
    }
}
exports.Qdrant = Qdrant;
// ===============================
