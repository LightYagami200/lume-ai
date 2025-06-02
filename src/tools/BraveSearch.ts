import { Tool } from '../interfaces/Tool'

/**
 * Tool for fetching web search results from the Brave Search API.
 * Requires a Brave Search API key (set as BRAVE_API_KEY in environment variables).
 */
export class BraveSearch extends Tool {
  private apiKey: string

  constructor(apiKey: string = process.env.BRAVE_API_KEY || '') {
    super(
      'brave-search',
      'Fetches web search results from Brave Search API.',
      [
        {
          name: 'query',
          type: 'string',
          description: 'The search query to look up.',
          required: true,
        },
      ],
      100
    )
    this.apiKey = apiKey
    if (!this.apiKey) {
      throw new Error('BraveSearch: Missing BRAVE_API_KEY!')
    }
  }

  get metadata() {
    return {
      name: this.name,
      description: this.description,
      parameters: this.parameters,
    }
  }

  get extraTokens() {
    return this._extraTokens
  }

  /**
   * Executes a Brave Search query.
   * @param params - { query: string }
   * @returns A concise string summary of the top Brave Search results for LLMs.
   */
  async execute(params: { query: string }): Promise<string> {
    const { query } = params
    if (!query) throw new Error('BraveSearch: Missing query parameter!')
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
      query
    )}`
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': this.apiKey,
      },
    })
    if (!res.ok) {
      throw new Error(
        `BraveSearch: API request failed with status ${res.status}`
      )
    }
    const data = await res.json()
    const results = data?.web?.results || []
    if (!Array.isArray(results) || results.length === 0) {
      return 'No relevant results found.'
    }
    // Limit to top 5 results for brevity
    const topResults = results.slice(0, 5)
    const summary = topResults
      .map((r: any, i: number) => {
        // Prefer description, fallback to extra_snippets if available
        let snippet =
          r.description || (r.extra_snippets && r.extra_snippets[0]) || ''
        // Remove HTML tags from snippet
        snippet = snippet.replace(/<[^>]+>/g, '').trim()
        return `#${i + 1}: ${r.title}\n${snippet}\nURL: ${r.url}`
      })
      .join('\n\n')
    return `Brave Search Results for: "${query}"

${summary}`
  }
}
