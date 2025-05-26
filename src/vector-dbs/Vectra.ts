/**
 * Vectra is a VectorDB implementation using the vectra LocalIndex for local vector storage and retrieval.
 */
// ===============================
// SECTION | IMPORTS
// ===============================
import { VectorDB } from '../interfaces'
import { LocalIndex, MetadataTypes, QueryResult } from 'vectra'
// ===============================

// ===============================
// SECTION | Vectra
// ===============================
export class Vectra extends VectorDB {
  private index: LocalIndex

  /**
   * Creates a new Vectra instance with a local index at the given path.
   * @param path - The file system path where the local index is stored.
   */
  constructor(path: string) {
    super()
    this.index = new LocalIndex(path)
  }

  /**
   * Adds a text and its vector representation to the index, associating it with one or more tags.
   * @param text - The text to store.
   * @param vector - The vector representation of the text.
   * @param tags - An array of tags to associate with the text/vector.
   */
  async add(text: string, vector: number[], tags: string[]) {
    if (!(await this.index.isIndexCreated())) {
      await this.index.createIndex()
    }

    for (const tag of tags) {
      await this.index.insertItem({
        vector,
        metadata: {
          tag,
          text,
        },
      })
    }
  }

  /**
   * Searches for items in the index that match the given vector and tags, optionally using the text for filtering.
   * @param text - The text to use for filtering or scoring (if supported).
   * @param vector - The query vector.
   * @param tags - An array of tags to filter the search.
   * @returns An array of matching texts as strings.
   */
  async search(text: string, vector: number[], tags: string[], topK?: number) {
    if (!(await this.index.isIndexCreated())) {
      await this.index.createIndex()
    }

    const items: QueryResult<Record<string, MetadataTypes>>[] = []

    for (const tag of tags) {
      const item = await this.index.queryItems(vector, text, topK || 5, {
        tag,
      })
      items.push(...item)
    }

    return items.map((item) =>
      String(item.item.metadata.text ? item.item.metadata.text : '')
    )
  }

  /**
   * Deletes all items from the index that match the given tags.
   * @param tags - An array of tags whose associated items should be deleted.
   */
  async delete(tags: string[]) {
    for (const tag of tags) {
      const items = await this.index.listItemsByMetadata({
        tag,
      })
      for (const item of items) {
        await this.index.deleteItem(item.id)
      }
    }
  }
}
// ===============================
