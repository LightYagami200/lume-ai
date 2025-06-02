import Sandbox from '@e2b/code-interpreter'
import { Tool } from '../interfaces/Tool'

/**
 * Tool for interpreting code on a safe sandbox environment.
 * Requires a E2B API key (set as E2B_API_KEY in environment variables).
 */
export class E2BCodeInterpreter extends Tool {
  private apiKey: string

  constructor(apiKey: string = process.env.E2B_API_KEY || '') {
    super(
      'e2b-code-interpreter',
      'Interprets code on a safe sandbox environment.',
      [
        {
          name: 'code',
          type: 'string',
          description: 'The code to interpret.',
          required: true,
        },
      ],
      100
    )
    this.apiKey = apiKey
    if (!this.apiKey) {
      throw new Error('E2BCodeInterpreter: Missing E2B_API_KEY!')
    }
  }

  get metadata() {
    return {
      name: this.name,
      description: this.description,
      parameters: this.parameters,
    }
  }

  get extraTokens() {
    return this._extraTokens
  }

  /**
   * Executes a E2B Code Interpreter.
   * @param params - { code: string }
   * @returns A concise string summary of the top E2B Code Interpreter results for LLMs.
   */
  async execute(params: { code: string }): Promise<string> {
    const { code } = params
    if (!code) throw new Error('E2BCodeInterpreter: Missing code parameter!')

    const sandbox = await Sandbox.create({
      apiKey: this.apiKey,
    })
    const result = await sandbox.runCode(code)

    await sandbox.kill()
    return result.text || 'No result'
  }
}
