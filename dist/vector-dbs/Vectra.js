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
exports.Vectra = void 0;
/**
 * Vectra is a VectorDB implementation using the vectra LocalIndex for local vector storage and retrieval.
 */
// ===============================
// SECTION | IMPORTS
// ===============================
const interfaces_1 = require("../interfaces");
const vectra_1 = require("vectra");
// ===============================
// ===============================
// SECTION | Vectra
// ===============================
class Vectra extends interfaces_1.VectorDB {
    /**
     * Creates a new Vectra instance with a local index at the given path.
     * @param path - The file system path where the local index is stored.
     */
    constructor(path) {
        super();
        this.index = new vectra_1.LocalIndex(path);
    }
    /**
     * Adds a text and its vector representation to the index, associating it with one or more tags.
     * @param text - The text to store.
     * @param vector - The vector representation of the text.
     * @param tags - An array of tags to associate with the text/vector.
     */
    add(text, vector, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.index.isIndexCreated())) {
                yield this.index.createIndex();
            }
            for (const tag of tags) {
                yield this.index.insertItem({
                    vector,
                    metadata: {
                        tag,
                        text,
                    },
                });
            }
        });
    }
    /**
     * Searches for items in the index that match the given vector and tags, optionally using the text for filtering.
     * @param text - The text to use for filtering or scoring (if supported).
     * @param vector - The query vector.
     * @param tags - An array of tags to filter the search.
     * @returns An array of matching texts as strings.
     */
    search(text, vector, tags, topK) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.index.isIndexCreated())) {
                yield this.index.createIndex();
            }
            const items = [];
            for (const tag of tags) {
                const item = yield this.index.queryItems(vector, text, topK || 5, {
                    tag,
                });
                items.push(...item);
            }
            return items.map((item) => String(item.item.metadata.text ? item.item.metadata.text : ''));
        });
    }
    /**
     * Deletes all items from the index that match the given tags.
     * @param tags - An array of tags whose associated items should be deleted.
     */
    delete(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const tag of tags) {
                const items = yield this.index.listItemsByMetadata({
                    tag,
                });
                for (const item of items) {
                    yield this.index.deleteItem(item.id);
                }
            }
        });
    }
}
exports.Vectra = Vectra;
// ===============================
