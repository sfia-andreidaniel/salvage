abstract class Instruction implements IInstruction {

    private parent: IInstruction = null;

    private type: ESalvageBlockType;

    private params: string[];

    constructor( type: ESalvageBlockType, params: string[] ) {
        this.type = type;
        this.params = params;
    }

    public withParent(parent: IInstruction) {
        this.parent = parent;
        return this;
    }

    public getParent(): IInstruction {
        return this.parent;
    }

    public getBlockType(): ESalvageBlockType {
        return this.type;
    }

    public getParam( index: number ): string {
        return this.params
            ? this.params[ index ] || null
            : null;
    }

    abstract allowChildren(): boolean;

    abstract parse(context: IContext): string;

    abstract append(instruction: IInstruction): IInstruction;

}