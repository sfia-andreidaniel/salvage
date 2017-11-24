class SALVAGE_INSTRUCTION_END extends SALVAGE_ABSTRACT_INSTRUCTION {

    constructor() {
        super(E_SALVAGE_BLOCK_TYPE.TOKEN_END, null);
    }

    public allowChildren(): boolean {
        return false;
    }

    public parse(context: I_SALVAGE_CONTEXT): string {
        return '';
    }

    public append(instruction: I_SALVAGE_INSTRUCTION): I_SALVAGE_INSTRUCTION {
        throw new Error('Cannot append something into a END block!');
    }

}