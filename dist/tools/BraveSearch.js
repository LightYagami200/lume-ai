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
exports.BraveSearch = void 0;
const Tool_1 = require("../interfaces/Tool");
/**
 * Tool for fetching web search results from the Brave Search API.
 * Requires a Brave Search API key (set as BRAVE_API_KEY in environment variables).
 */
class BraveSearch extends Tool_1.Tool {
    constructor(apiKey = process.env.BRAVE_API_KEY || '') {
        super('brave-search', 'Fetches web search results from Brave Search API.', [
            {
                name: 'query',
                type: 'string',
                description: 'The search query to look up.',
                required: true,
            },
        ], 100);
        this.apiKey = apiKey;
        if (!this.apiKey) {
            throw new Error('BraveSearch: Missing BRAVE_API_KEY!');
        }
    }
    get metadata() {
        return {
            name: this.name,
            description: this.description,
            parameters: this.parameters,
        };
    }
    get extraTokens() {
        return this._extraTokens;
    }
    /**
     * Executes a Brave Search query.
     * @param params - { query: string }
     * @returns A concise string summary of the top Brave Search results for LLMs.
     */
    execute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { query } = params;
            if (!query)
                throw new Error('BraveSearch: Missing query parameter!');
            const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`;
            const res = yield fetch(url, {
                headers: {
                    Accept: 'application/json',
                    'Accept-Encoding': 'gzip',
                    'X-Subscription-Token': this.apiKey,
                },
            });
            if (!res.ok) {
                throw new Error(`BraveSearch: API request failed with status ${res.status}`);
            }
            const data = yield res.json();
            const results = ((_a = data === null || data === void 0 ? void 0 : data.web) === null || _a === void 0 ? void 0 : _a.results) || [];
            if (!Array.isArray(results) || results.length === 0) {
                return 'No relevant results found.';
            }
            // Limit to top 5 results for brevity
            const topResults = results.slice(0, 5);
            const summary = topResults
                .map((r, i) => {
                // Prefer description, fallback to extra_snippets if available
                let snippet = r.description || (r.extra_snippets && r.extra_snippets[0]) || '';
                // Remove HTML tags from snippet
                snippet = snippet.replace(/<[^>]+>/g, '').trim();
                return `#${i + 1}: ${r.title}\n${snippet}\nURL: ${r.url}`;
            })
                .join('\n\n');
            return `Brave Search Results for: "${query}"

${summary}`;
        });
    }
}
exports.BraveSearch = BraveSearch;
