class SALVAGE_CONTEXT implements I_SALVAGE_CONTEXT {

    private model: I_SALVAGE_MODEL;

    private parent: I_SALVAGE_CONTEXT = null;

    private helpers: I_SALVAGE_HELPER[];

    constructor(model: I_SALVAGE_MODEL, parent: I_SALVAGE_CONTEXT, helpers: I_SALVAGE_HELPER[] ) {
        this.model = model;
        this.parent = parent || null;
        this.helpers = helpers || [];
    }

    public getModel(): I_SALVAGE_MODEL {
        return this.model;
    }

    public get(variable: string): any {

        if ( 'this' === variable ) {
            return this.model;
        }

        let segments: string[] = variable.split('/'),
            numSegments: number = segments.length,
            result: any;

        if ( numSegments > 1 ) {

            result = this.cd( segments.slice(0, numSegments - 1 ).join('/') ).get( segments[ numSegments - 1 ] );

        } else {

            if ( segments[0] == '..' ) {

                result = this.getParent().getModel();

            } else {

                result = this.model[segments[0]];

            }

        }

        if ( null === result || undefined === result ) {
            return '';
        } else {
            return result;
        }

    }

    public getHelper( name: string ): I_SALVAGE_HELPER {

        for ( let i=0, len = this.helpers.length; i<len; i++ ) {
            if ( this.helpers[i].name === name ) {
                return this.helpers[i];
            }
        }

        throw new Error('HELPER "' + name + '" not found!');
    }

    public isNotEmpty( variable: string ): boolean {

        let result = this.get( variable );

        if ( !result ) {
            return false;
        } else {

            if ( result instanceof Array && result.length === 0 ) {
                return false;
            }

            return true;
        }

    }

    public cd(path: string): I_SALVAGE_CONTEXT {

        let segments: string[] = path.split('/');

        if ( segments.length === 1 ) {
            return new SALVAGE_CONTEXT( this.get( segments[0]  ) || {}, this, this.helpers );
        } else {
            return new SALVAGE_CONTEXT( this.get( segments[0] ) || {}, this, this.helpers ).cd( segments.slice(1).join('/') );
        }

    }

    public each(variable: string, callback: I_SALVAGE_CALLBACK_CONTEXT) {

        let result = this.get(variable) || [];

        if ( result && result instanceof Array ) {

            for ( let i=0, len = result.length; i<len; i++ ) {

                callback( new SALVAGE_CONTEXT( result[i], this, this.helpers ) );

            }

        }

    }

    public getParent(): I_SALVAGE_CONTEXT {
        if (this.parent) {
            return this.parent;
        } else {
            throw new Error('Failed to get context parent!');
        }
    }

}