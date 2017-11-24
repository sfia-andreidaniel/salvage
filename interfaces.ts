enum ESalvageBlockType {
    TOKEN_VAR,
    TOKEN_IF,
    TOKEN_ELSE,
    TOKEN_UNLESS,
    TOKEN_EACH,
    TOKEN_END,
    TOKEN_TEXT,
    TOKEN_COMMENT,
}

interface ISalvageBlockSettings {
    escaped?: boolean;
    negated?: boolean;
}

interface ISalvageBlock {
    token: ESalvageBlockType;
    params: string[];
    settings?: ISalvageBlockSettings;
    text: string;
}

interface ISalvageModel {
    [ key: string ]: number | string | boolean | null | ISalvageModel | ISalvageModel[];
}

interface IContextCallback {
    ( element: IContext ): void;
}

interface IContext {
    get( variable: string ): any;
    cd( path: string ): IContext;
    each( variable: string, callback: IContextCallback );
    getParent(): IContext;
}

interface IInstruction {
    parse( context: IContext ): string;
    append( instruction: IInstruction ): IInstruction;
    withParent(parent: IInstruction ): this;
    getParent(): IInstruction;
    getBlockType(): ESalvageBlockType;
    allowChildren(): boolean;
    getParam( index: number ): string;
}