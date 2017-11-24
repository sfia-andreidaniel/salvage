class VAR extends Instruction {

    private isEscaped: boolean;

    constructor( params: string[], isEscaped: boolean ) {
        super( ESalvageBlockType.TOKEN_VAR, params );
        this.isEscaped = isEscaped;
    }

    public allowChildren(): boolean {
        return false;
    }

    public parse(context: IContext): string {
        return context.get( this.getParam(0) );
    }

    public append(instruction: IInstruction): IInstruction {
        throw new Error('A VAR block does not allow insertion')
    }

}