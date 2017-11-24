abstract class SALVAGE_ABSTRACT_INSTRUCTION implements I_SALVAGE_INSTRUCTION {

    private parent: I_SALVAGE_INSTRUCTION = null;

    private type: E_SALVAGE_BLOCK_TYPE;

    protected params: string[];

    constructor(type: E_SALVAGE_BLOCK_TYPE, params: string[] ) {
        this.type = type;
        this.params = params;
    }

    public withParent(parent: I_SALVAGE_INSTRUCTION) {
        this.parent = parent;
        return this;
    }

    public getParent(): I_SALVAGE_INSTRUCTION {
        return this.parent;
    }

    public getBlockType(): E_SALVAGE_BLOCK_TYPE {
        return this.type;
    }

    public getParam( index: number ): string {
        return this.params
            ? this.params[ index ] || null
            : null;
    }

    public setParam( index: number, value: string ) {
        this.params[ index ] = value;
    }

    abstract allowChildren(): boolean;

    abstract parse(context: I_SALVAGE_CONTEXT): string;

    abstract append(instruction: I_SALVAGE_INSTRUCTION): I_SALVAGE_INSTRUCTION;

}