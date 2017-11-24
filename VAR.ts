class SALVAGE_BLOCK_VAR extends SALVAGE_ABSTRACT_INSTRUCTION {

    private isEscaped: boolean;

    constructor( params: string[], isEscaped: boolean ) {

        super( E_SALVAGE_BLOCK_TYPE.TOKEN_VAR, [] );

        this.params.push( Salvage.normalizePath( params[0] ) );

        if ( this.params[0] === null ) {
            throw new Error('Illegal variable: ' + params[0] );
        }

        for ( let i=1, len = params.length; i<len; i++ ) {
            this.params.push( params[i] );
        }

        this.isEscaped = isEscaped;
    }

    public allowChildren(): boolean {
        return false;
    }

    public parse(context: I_SALVAGE_CONTEXT): string {

        let result = String( context.get( this.getParam(0) ) );

        for ( let i=1, len = this.params.length; i<len; i++ ) {
            result = context.getHelper( this.params[i] ).func( result );
        }

        if ( !this.isEscaped ) {

            return result;

        } else {

            return result.replace(/"/g, '&quot;' ).replace(/>/g, '&gt;' ).replace(/</g, '&lt;' );

        }
    }

    public append(instruction: I_SALVAGE_INSTRUCTION): I_SALVAGE_INSTRUCTION {
        throw new Error('A VAR block does not allow insertion')
    }

}