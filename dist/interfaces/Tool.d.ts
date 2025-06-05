/**
 * Abstract class representing a Tool interface.
 * Implementations should provide a way to execute a tool.
 */
export declare abstract class Tool {
    protected name: string;
    protected description: string;
    protected parameters: Array<{
        name: string;
        type: string;
        description: string;
        required: boolean;
    }>;
    protected _extraTokens: number;
    constructor(name: string, description: string, parameters: Array<{
        name: string;
        type: string;
        description: string;
        required: boolean;
    }>, extraTokens?: number);
    abstract get metadata(): {
        name: string;
        description: string;
        parameters: Array<{
            name: string;
            type: string;
            description: string;
            required: boolean;
        }>;
    };
    abstract get extraTokens(): number;
    abstract execute(params: Record<string, any>): Promise<string>;
}
