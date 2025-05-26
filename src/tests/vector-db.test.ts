// ===============================
// SECTION | IMPORTS
// ===============================
import 'dotenv/config'
import { describe, test, expect } from '@jest/globals'
import { Lume } from '../index'
import { OpenAI } from '../llms'
import path from 'path'
import { Pinecone, Vectra } from '../vector-dbs'
// ===============================

// ===============================
// SECTION | TESTS
// ===============================
describe('Vector DB Tests', () => {
  test('should use Vectra as the vector database', async () => {
    const lume = new Lume({
      llm: new OpenAI(process.env.OPENAI_API_KEY || ''),
      vectorDB: new Vectra(path.join(__dirname, 'index')),
    })
    const response1 = await lume.chat('Hello, my name is John', {
      tags: ['user-1'],
    })
    console.log('AI Response:', response1)
    expect(response1).toBeDefined()
    const response2 = await lume.chat('What is my name?', {
      tags: ['user-1'],
    })
    console.log('AI Response:', response2)
    expect(response2).toContain('John')
  })

  test('should use Pinecone as the vector database', async () => {
    const lume = new Lume({
      llm: new OpenAI(process.env.OPENAI_API_KEY || ''),
      vectorDB: new Pinecone({
        apiKey: process.env.PINECONE_API_KEY || '',
        indexName: 'test',
        namespace: 'test-namespace',
      }),
    })
    const response1 = await lume.chat('Hello, my name is John', {
      tags: ['user-1'],
    })
    console.log('AI Response:', response1)
    expect(response1).toBeDefined()
    const response2 = await lume.chat('What is my name?', {
      tags: ['user-1'],
    })
    console.log('AI Response:', response2)
    expect(response2).toContain('John')
  })
})
// ===============================
