enum E_SALVAGE_BLOCK_TYPE {
    TOKEN_VAR,
    TOKEN_IF,
    TOKEN_ELSE,
    TOKEN_UNLESS,
    TOKEN_EACH,
    TOKEN_END,
    TOKEN_TEXT,
    TOKEN_WITH,
    TOKEN_COMMENT,
}

interface I_SALVAGE_BLOCK_SETTINGS {
    escaped?: boolean;
    negated?: boolean;
}

interface I_SALVAGE_BLOCK {
    token: E_SALVAGE_BLOCK_TYPE;
    params: string[];
    settings?: I_SALVAGE_BLOCK_SETTINGS;
    text: string;
}

interface I_SALVAGE_MODEL {
    [ key: string ]: number | string | boolean | null | I_SALVAGE_MODEL | I_SALVAGE_MODEL[];
}

interface I_SALVAGE_CALLBACK_CONTEXT {
    ( element: I_SALVAGE_CONTEXT ): void;
}

interface I_SALVAGE_HELPER {
    name: string;
    func: ( v: any ) => any;
}

interface I_SALVAGE_CONTEXT {
    get( variable: string ): any;
    cd( path: string ): I_SALVAGE_CONTEXT;
    each( variable: string, callback: I_SALVAGE_CALLBACK_CONTEXT );
    getParent(): I_SALVAGE_CONTEXT;
    getModel(): I_SALVAGE_MODEL;
    isNotEmpty( variable: string ): boolean;
    getHelper( helperName: string ): I_SALVAGE_HELPER;
}

interface I_SALVAGE_INSTRUCTION {
    parse( context: I_SALVAGE_CONTEXT ): string;
    append( instruction: I_SALVAGE_INSTRUCTION ): I_SALVAGE_INSTRUCTION;
    withParent(parent: I_SALVAGE_INSTRUCTION ): this;
    getParent(): I_SALVAGE_INSTRUCTION;
    getBlockType(): E_SALVAGE_BLOCK_TYPE;
    allowChildren(): boolean;
    getParam( index: number ): string;
}