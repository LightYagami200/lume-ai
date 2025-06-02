// ===============================
// SECTION | IMPORTS
// ===============================
import 'dotenv/config'
import { describe, expect, test } from '@jest/globals'
import { BraveSearch, E2BCodeInterpreter } from '../tools'
import { Anthropic, OpenAI } from '../llms'
import { Lume } from '../services/Lume'
// ===============================

// ===============================
// SECTION | TESTS
// ===============================
describe('Tools Tests', () => {
  test('should work with BraveSearch', async () => {
    const lume = new Lume({
      llm: new OpenAI(process.env.OPENAI_API_KEY || ''),
      tools: [new BraveSearch(process.env.BRAVE_SEARCH_API_KEY || '')],
    })

    const response = await lume.chat(
      'What is the capital of France? search the web',
      {
        tags: ['test-tools-1'],
      }
    )

    expect(response).toContain('Paris')
  })

  test('should work with BraveSearch and Anthropic', async () => {
    const lume = new Lume({
      llm: new Anthropic(process.env.ANTHROPIC_API_KEY || ''),
      tools: [new BraveSearch(process.env.BRAVE_SEARCH_API_KEY || '')],
    })

    const response = await lume.chat(
      'What is the capital of France? search the web',
      {
        tags: ['test-tools-1'],
      }
    )

    expect(response).toContain('Paris')
  })

  test('should work with E2BCodeInterpreter', async () => {
    const lume = new Lume({
      llm: new OpenAI(process.env.OPENAI_API_KEY || ''),
      tools: [new E2BCodeInterpreter(process.env.E2B_API_KEY || '')],
    })

    const response = await lume.chat('What is the square root of 16?', {
      tags: ['test-tools-1'],
    })

    expect(response).toContain('4')
  })
})
// ===============================
