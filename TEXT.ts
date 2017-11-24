class TEXT extends Instruction {

    private text: string;

    constructor( text: string ) {
        super( ESalvageBlockType.TOKEN_TEXT, null );
        this.text = text;
    }

    allowChildren(): boolean {
        return false;
    }

    parse(context: IContext): string {
        return this.text;
    }

    append(instruction: IInstruction): IInstruction {
        throw new Error("Method not allowed.");
    }

}