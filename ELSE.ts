class SALVAGE_INSTRUCTION_ELSE extends SALVAGE_ABSTRACT_INSTRUCTION {

    constructor() {
        super(E_SALVAGE_BLOCK_TYPE.TOKEN_ELSE, null);
    }

    public allowChildren(): boolean {
        return false;
    }

    public parse(context: I_SALVAGE_CONTEXT): string {
        throw new Error("Should never be parsed");
    }

    public append(instruction: I_SALVAGE_INSTRUCTION): I_SALVAGE_INSTRUCTION {
        throw new Error("Cannot have children");
    }

    public withParent( parent: SALVAGE_ABSTRACT_INSTRUCTION ): this {
        if ( !parent || ( parent.getBlockType() !== E_SALVAGE_BLOCK_TYPE.TOKEN_IF && parent.getBlockType() !== E_SALVAGE_BLOCK_TYPE.TOKEN_UNLESS ) ) {
            throw new Error('Invalid ELSE block parent: Expected IF or UNLESS!');
        }
        return this;
    }

}