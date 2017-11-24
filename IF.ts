class IF extends Instruction {

    private elseAppended: boolean = false;

    private trueBranchChildren: IInstruction[] = [];

    private falseBranchChildren: IInstruction[] = [];

    constructor(params: string[]) {
        super(ESalvageBlockType.TOKEN_IF, params);
    }

    public append(instruction: IInstruction): IInstruction {

        if (instruction.getBlockType() === ESalvageBlockType.TOKEN_ELSE) {

            if (this.elseAppended) {

                throw new Error('Else appended!');

            } else {

                this.elseAppended = true;

            }

            return this;

        } else {

            if (instruction.getBlockType() === ESalvageBlockType.TOKEN_END) {

                return this.getParent();

            } else {

                instruction.withParent(this);

                if (this.elseAppended) {

                    this.falseBranchChildren.push(instruction.withParent(this));

                } else {

                    this.trueBranchChildren.push(instruction.withParent(this));

                }

                return instruction.allowChildren()
                    ? instruction
                    : this;

            }

        }

    }

    public allowChildren(): boolean {
        return true;
    }

    public parse(context: IContext): string {

        let result: string = '';

        if (context.get(this.getParam(0))) {

            for (let i = 0, len = this.trueBranchChildren.length; i < len; i++) {
                result = result.concat(this.trueBranchChildren[i].parse(context));
            }

        } else {

            for (let i = 0, len = this.falseBranchChildren.length; i < len; i++) {
                result = result.concat(this.falseBranchChildren[i].parse(context));
            }

        }

        return result;

    }

}