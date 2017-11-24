class SALVAGE_INSTRUCTION_EACH extends SALVAGE_ABSTRACT_INSTRUCTION {

    private children: I_SALVAGE_INSTRUCTION[];

    constructor(params: string[]) {

        super(E_SALVAGE_BLOCK_TYPE.TOKEN_EACH, []);

        this.children = [];

        this.params.push( Salvage.normalizePath( params[0] ) );

        if ( null === this.params[0] ) {
            throw new Error('Illegal each argument!' );
        }

    }

    public allowChildren(): boolean {
        return true;
    }

    public parse(context: I_SALVAGE_CONTEXT): string {

        let result: string = '';

        (function (self: SALVAGE_INSTRUCTION_EACH) {

            context.each(self.getParam(0), function (item: I_SALVAGE_CONTEXT) {
                for (let i = 0, len = self.children.length; i < len; i++) {
                    result = result.concat(self.children[i].parse(item));
                }
            });

        })(this);

        return result;

    }

    public append(instruction: I_SALVAGE_INSTRUCTION): I_SALVAGE_INSTRUCTION {

        this.children.push(instruction.withParent(this));

        return instruction;

    }

}