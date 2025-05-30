// ===============================
// SECTION | IMPORTS
// ===============================
import { v4 } from 'uuid'
import { VectorDB } from '../interfaces'
import { QdrantClient } from '@qdrant/js-client-rest'
// ===============================

// ===============================
// SECTION | Qdrant
// ===============================
/**
 * Qdrant is a VectorDB implementation using the Qdrant cloud vector database provider.
 */
export class Qdrant extends VectorDB {
  private client: QdrantClient
  private collectionName: string

  /**
   * Creates a new Qdrant instance with the given API key and collection name.
   * @param opts - The configuration options for Qdrant.
   * @param opts.apiKey - The Qdrant API key.
   * @param opts.collectionName - The name of the Qdrant collection to use.
   * @param opts.url - The URL of the Qdrant server.
   */
  constructor(opts: { apiKey: string; collectionName: string; url: string }) {
    super()
    this.client = new QdrantClient({ apiKey: opts.apiKey, url: opts.url })
    this.collectionName = opts.collectionName
  }

  /**
   * Adds a text and its vector representation to the Pinecone index, associating it with one or more tags.
   * @param text - The text to store.
   * @param vector - The vector representation of the text.
   * @param tags - An array of tags to associate with the text/vector.
   */
  async add(text: string, vector: number[], tags: string[]) {
    const collection = await this.client.getCollection(this.collectionName)
    if (!collection) {
      await this.client.createCollection(this.collectionName, {
        vectors: {
          size: vector.length,
          distance: 'Cosine',
        },
      })
    }

    // -> Create payload index
    const payloadIndexes = collection.payload_schema['tag']

    if (!payloadIndexes) {
      await this.client.createPayloadIndex(this.collectionName, {
        field_name: 'tag',
        field_schema: 'keyword',
        wait: true,
      })

      await this.client.createPayloadIndex(this.collectionName, {
        field_name: 'text',
        field_schema: 'text',
        wait: true,
      })
    }

    for (const tag of tags) {
      await this.client.upsert(this.collectionName, {
        wait: true,
        points: [
          {
            id: v4(),
            vector,
            payload: {
              text,
              tag,
            },
          },
        ],
      })
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
    const items: Awaited<ReturnType<typeof this.client.search>> = []

    for (const tag of tags) {
      try {
        const item = await this.client.search(this.collectionName, {
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
        })
        items.push(...item)
      } catch (e) {
        console.error(e)
      }
    }

    return items.map((item) => String(item.payload?.text))
  }

  /**
   * Deletes all items from the Pinecone index that match the given tags.
   * @param tags - An array of tags whose associated items should be deleted.
   */
  async delete(tags: string[]) {
    for (const tag of tags) {
      await this.client.delete(this.collectionName, {
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
      })
    }
  }
}
// ===============================
