class SALVAGE_BLOCK_WITH extends SALVAGE_ABSTRACT_INSTRUCTION {

    private children: I_SALVAGE_INSTRUCTION[] = [];

    constructor( params: string[] ) {

        super( E_SALVAGE_BLOCK_TYPE.TOKEN_WITH, [] );

        this.params.push( Salvage.normalizePath( params[0] ) );

        if ( null === this.params[0] ) {
            throw new Error('Illegal WITH argument' );
        }

    }

    public allowChildren(): boolean {
        return true;
    }

    public parse(context: I_SALVAGE_CONTEXT): string {

        let ctx: I_SALVAGE_CONTEXT = context.cd( this.getParam(0) ),
            result: string = '';

        for ( let i=0, len = this.children.length; i<len; i++ ) {
            result = result.concat( this.children[i].parse( ctx ) );
        }

        return result;
    }

    public append(instruction: I_SALVAGE_INSTRUCTION): I_SALVAGE_INSTRUCTION {
        this.children.push( instruction.withParent(this) );
        return instruction;
    }


}