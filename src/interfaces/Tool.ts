// ===============================
// SECTION | IMPORTS
// ===============================
import { Message } from './History'
// ===============================

// ===============================
// SECTION | TOOL
// ===============================
/**
 * Abstract class representing a Tool interface.
 * Implementations should provide a way to execute a tool.
 */
export abstract class Tool {
  protected name: string
  protected description: string
  protected parameters: Array<{
    name: string
    type: string
    description: string
    required: boolean
  }>
  protected _extraTokens: number

  constructor(
    name: string,
    description: string,
    parameters: Array<{
      name: string
      type: string
      description: string
      required: boolean
    }>,
    extraTokens: number = 0
  ) {
    this.name = name
    this.description = description
    this.parameters = parameters
    this._extraTokens = extraTokens
  }

  abstract get metadata(): {
    name: string
    description: string
    parameters: Array<{
      name: string
      type: string
      description: string
      required: boolean
    }>
  }

  abstract get extraTokens(): number

  abstract execute(params: Record<string, any>): Promise<string>
}
// ===============================
