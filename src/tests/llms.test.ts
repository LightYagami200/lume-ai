// ===============================
// SECTION | IMPORTS
// ===============================
import 'dotenv/config'
import { describe, test, expect } from '@jest/globals'
import { Lume } from '../index'
import { OpenAI, Anthropic, Gemini } from '../llms'
// ===============================

// ===============================
// SECTION | TESTS
// ===============================
describe('LLM Tests', () => {
  test('should work with OpenAI', async () => {
    const lume = new Lume({ llm: new OpenAI(process.env.OPENAI_API_KEY || '') })
    const response = await lume.chat('Hello, how are you?')
    console.log('AI Response:', response)
    expect(response).toBeDefined()
  })

  test('should work with Anthropic', async () => {
    const lume = new Lume({
      llm: new Anthropic(process.env.ANTHROPIC_API_KEY || ''),
    })
    const response = await lume.chat('Hello, how are you?')
    console.log('AI Response:', response)
    expect(response).toBeDefined()
  })

  test('should work with Gemini', async () => {
    const lume = new Lume({
      llm: new Gemini(process.env.GEMINI_API_KEY || ''),
    })
    const response = await lume.chat('Hello, how are you?')
    console.log('AI Response:', response)
    expect(response).toBeDefined()
  })
})
// ===============================
