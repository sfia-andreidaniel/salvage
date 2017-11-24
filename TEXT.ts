class SALVAGE_TEXT extends SALVAGE_ABSTRACT_INSTRUCTION {

    private text: string;

    constructor( text: string ) {
        super( E_SALVAGE_BLOCK_TYPE.TOKEN_TEXT, null );
        this.text = text;
    }

    allowChildren(): boolean {
        return false;
    }

    parse(context: I_SALVAGE_CONTEXT): string {
        return this.text;
    }

    append(instruction: I_SALVAGE_INSTRUCTION): I_SALVAGE_INSTRUCTION {
        throw new Error("Method not allowed.");
    }

}