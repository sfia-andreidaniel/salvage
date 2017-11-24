class SALVAGE_UNLESS extends SALVAGE_ABSTRACT_INSTRUCTION {

    private elseAppended: boolean = false;

    private trueBranchChildren: I_SALVAGE_INSTRUCTION[] = [];

    private falseBranchChildren: I_SALVAGE_INSTRUCTION[] = [];

    constructor(params: string[]) {

        super(E_SALVAGE_BLOCK_TYPE.TOKEN_UNLESS, []);

        this.params[0] = Salvage.normalizePath( params[0] );

        if ( null === this.params[0] ) {
            throw new Error('Illegal UNLESS variable: ' + params[0] );
        }

    }

    public append(instruction: I_SALVAGE_INSTRUCTION): I_SALVAGE_INSTRUCTION {

        if (instruction.getBlockType() === E_SALVAGE_BLOCK_TYPE.TOKEN_ELSE) {

            if (this.elseAppended) {

                throw new Error('Else appended!');

            }

            this.elseAppended = true;

        }

        if ( this.elseAppended ) {

            this.falseBranchChildren.push( instruction );

        } else {

            this.trueBranchChildren.push( instruction );

        }

        return instruction.withParent( this );

    }

    public allowChildren(): boolean {
        return true;
    }

    public parse(context: I_SALVAGE_CONTEXT): string {

        let result: string = '';

        if ( !context.isNotEmpty(this.getParam(0))) {

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