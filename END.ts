class END extends Instruction {

    constructor() {
        super(ESalvageBlockType.TOKEN_END, null);
    }

    public allowChildren(): boolean {
        return false;
    }

    public parse(context: IContext): string {
        return '';
    }

    public append(instruction: IInstruction): IInstruction {
        throw new Error('Cannot append something into a END block!');
    }

}