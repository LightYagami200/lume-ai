// ===============================
// SECTION | IMPORTS
// ===============================
import 'dotenv/config'
import { describe, test, expect } from '@jest/globals'
import { Lume } from '../index'
import { OpenAI } from '../llms'
import { Custom, Flirty, Friendly, Professional } from '../genes'
// ===============================

// ===============================
// SECTION | TESTS
// ===============================
describe('Gene Tests', () => {
  test('should use custom gene', async () => {
    const lume = new Lume({
      llm: new OpenAI(process.env.OPENAI_API_KEY || ''),
      gene: new Custom(),
    })
    const response = await lume.chat('Hello, how are you?')
    console.log('AI Response:', response)
    expect(response).toBeDefined()
  })

  test('should use friendly gene', async () => {
    const lume = new Lume({
      llm: new OpenAI(process.env.OPENAI_API_KEY || ''),
      gene: new Friendly(),
    })
    const response = await lume.chat(
      'Hello, how are you and what is your name?'
    )
    console.log('AI Response:', response)
    expect(response).toContain('Lume')
  })

  test('should use professional gene', async () => {
    const lume = new Lume({
      llm: new OpenAI(process.env.OPENAI_API_KEY || ''),
      gene: new Professional(),
    })
    const response = await lume.chat(
      'Hello, how are you and what is your name?'
    )
    console.log('AI Response:', response)
    expect(response).toContain('Lume')
  })

  test('should use flirty gene', async () => {
    const lume = new Lume({
      llm: new OpenAI(process.env.OPENAI_API_KEY || ''),
      gene: new Flirty(),
    })
    const response = await lume.chat(
      'Hello, how are you and what is your name?'
    )
    console.log('AI Response:', response)
    expect(response).toContain('Lume')
  })
})
// ===============================
