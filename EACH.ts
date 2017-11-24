class EACH extends Instruction {

    private children: IInstruction[];

    constructor(params: string[]) {
        super(ESalvageBlockType.TOKEN_EACH, params);
        this.children = [];
    }

    public allowChildren(): boolean {
        return true;
    }

    public parse(context: IContext): string {

        let result: string = '';

        (function (self: EACH) {

            context.each(this.getParam(0), function (item: IContext) {
                for (let i = 0, len = self.children.length; i < len; i++) {
                    result = result.concat(self.children[i].parse(item));
                }
            });

        })(this);

        return result;

    }

    public append(instruction: IInstruction): IInstruction {

        if (instruction.getBlockType() === ESalvageBlockType.TOKEN_END) {

            return this.getParent();

        } else {

            this.children.push(instruction.withParent(this));

            return instruction.allowChildren()
                ? instruction
                : this;
        }

    }

}