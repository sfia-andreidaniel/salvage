class ELSE extends Instruction {

    constructor() {
        super(ESalvageBlockType.TOKEN_ELSE, null);
    }

    public allowChildren(): boolean {
        return false;
    }

    public parse(context: IContext): string {
        throw new Error("Should never be parsed");
    }

    public append(instruction: IInstruction): IInstruction {
        throw new Error("Cannot have children");
    }

}