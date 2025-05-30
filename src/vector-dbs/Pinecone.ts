// ===============================
// SECTION | IMPORTS
// ===============================
import { VectorDB } from '../interfaces'
import {
  Index,
  Pinecone as PineconeProvider,
  RecordMetadata,
  ScoredPineconeRecord,
} from '@pinecone-database/pinecone'
// ===============================

// ===============================
// SECTION | Pinecone
// ===============================
/**
 * Pinecone is a VectorDB implementation using the Pinecone cloud vector database provider.
 */
export class Pinecone extends VectorDB {
  private pc: PineconeProvider
  private index: Index
  private namespace: string

  /**
   * Creates a new Pinecone instance with the given API key, index name, and namespace.
   * @param opts - The configuration options for Pinecone.
   * @param opts.apiKey - The Pinecone API key.
   * @param opts.indexName - The name of the Pinecone index to use.
   * @param opts.namespace - The namespace within the index to operate in.
   */
  constructor(opts: { apiKey: string; indexName: string; namespace: string }) {
    super()
    this.pc = new PineconeProvider({ apiKey: opts.apiKey })
    this.index = this.pc.Index(opts.indexName)
    this.namespace = opts.namespace
  }

  /**
   * Adds a text and its vector representation to the Pinecone index, associating it with one or more tags.
   * @param text - The text to store.
   * @param vector - The vector representation of the text.
   * @param tags - An array of tags to associate with the text/vector.
   */
  async add(text: string, vector: number[], tags: string[]) {
    for (const tag of tags) {
      await this.index.namespace(this.namespace).upsert([
        {
          id: `mem_${Date.now()}`,
          values: vector,
          metadata: {
            text,
            tag,
          },
        },
      ])
    }
  }

  /**
   * Searches for items in the Pinecone index that match the given vector and tags.
   * @param _text - The text to use for filtering or scoring (currently unused).
   * @param vector - The query vector.
   * @param tags - An array of tags to filter the search.
   * @returns An array of matching texts as strings.
   */
  async search(_text: string, vector: number[], tags: string[], topK?: number) {
    const items: ScoredPineconeRecord<RecordMetadata>[] = []

    for (const tag of tags) {
      const item = await this.index.namespace(this.namespace).query({
        vector,
        topK: topK || 3,
        includeMetadata: true,
        filter: {
          tag,
        },
      })

      items.push(...item.matches)
    }

    return items.map((item) => String(item.metadata?.text))
  }

  /**
   * Deletes all items from the Pinecone index that match the given tags.
   * @param tags - An array of tags whose associated items should be deleted.
   */
  async delete(tags: string[]) {
    for (const tag of tags) {
      await this.index.namespace(this.namespace).deleteMany({
        filter: {
          tag,
        },
      })
    }
  }
}
// ===============================
