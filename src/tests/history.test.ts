// ===============================
// SECTION | IMPORTS
// ===============================
import 'dotenv/config'
import { describe, test, expect } from '@jest/globals'
import { Lume } from '../index'
import { OpenAI } from '../llms'
import { Memory, Redis, SQLite } from '../histories'
// ===============================

// ===============================
// SECTION | TESTS
// ===============================
describe('History Tests', () => {
  test('should store messages in memory', async () => {
    const lume = new Lume({
      llm: new OpenAI(process.env.OPENAI_API_KEY || ''),
      history: new Memory(),
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

  test('should store messages in redis', async () => {
    const lume = new Lume({
      llm: new OpenAI(process.env.OPENAI_API_KEY || ''),
      history: new Redis(),
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

  test('should store messages in sqlite', async () => {
    const lume = new Lume({
      llm: new OpenAI(process.env.OPENAI_API_KEY || ''),
      history: new SQLite(),
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
