// ===============================
// SECTION | IMPORTS
// ===============================
import 'dotenv/config'
import { describe, test, expect } from '@jest/globals'
import { Lume } from '../index'
import { OpenAI } from '../llms'
// ===============================

// ===============================
// SECTION | TESTS
// ===============================
describe('Base Tests', () => {
  test('should chat with the model', async () => {
    const lume = new Lume({ llm: new OpenAI(process.env.OPENAI_API_KEY || '') })
    const response = await lume.chat('Hello, how are you?')
    console.log('AI Response:', response)
    expect(response).toBeDefined()
  })
})
// ===============================
