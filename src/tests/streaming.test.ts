// ===============================
// SECTION | IMPORTS
// ===============================
import 'dotenv/config'
import { describe, test, expect } from '@jest/globals'
import { Lume } from '../index'
import { Anthropic, OpenAI } from '../llms'
import { Friendly } from '../genes'
// ===============================

// ===============================
// SECTION | TESTS
// ===============================
describe('Streaming Tests', () => {
  test('should stream response from OpenAI', async () => {
    const lume = new Lume({
      llm: new OpenAI(process.env.OPENAI_API_KEY || ''),
      gene: new Friendly(),
    })
    const chunks: string[] = []
    for await (const chunk of lume.chatStream(
      'Can you write a short paragraph about an adorable AI?'
    )) {
      chunks.push(chunk)
      process.stdout.write(chunk) // For visual feedback during test run
    }

    const fullResponse = chunks.join('')
    console.log('Streamed Response: ', fullResponse)

    expect(fullResponse).toBeDefined()
    expect(fullResponse.length).toBeGreaterThan(0)
  })

  test('should stream response from Anthropic', async () => {
    const lume = new Lume({
      llm: new Anthropic(process.env.ANTHROPIC_API_KEY || ''),
      gene: new Friendly(),
    })
    const chunks: string[] = []
    for await (const chunk of lume.chatStream(
      'Can you write a short paragraph about an adorable AI?'
    )) {
      chunks.push(chunk)
    }

    const fullResponse = chunks.join('')
    console.log('Streamed Response: ', fullResponse)

    expect(fullResponse).toBeDefined()
    expect(fullResponse.length).toBeGreaterThan(0)
  })
})
// ===============================
