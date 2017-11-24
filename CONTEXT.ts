class CONTEXT implements IContext {

    private model: ISalvageModel;

    private parent: IContext = null;

    constructor(model: ISalvageModel, parent?: IContext) {
        this.model = model;
        this.parent = parent || null;
    }

    public get(variable: string) {
        return this.model && this.model[variable]
            ? this.model[variable]
            : null;
    }

    public cd(path: string): IContext {

        let segments: string[] = path.split('/'),
            cursor: IContext = this;

        for (let i = 0, len = segments.length; i < len; i++) {

            switch (segments[i]) {

                case '.':
                case 'this':
                case '':
                    break;

                case '..':
                    cursor = cursor.getParent();
                    break;

                default:

                    if (this.model[segments[i]] && this.model[segments[i]] instanceof Object) {
                        return new CONTEXT(<ISalvageModel>this.model[segments[i]], this);
                    } else {
                        throw new Error('Failed to create model from segment: ' + segments.slice(i).join('/') );
                    }

            }

        }
    }

    public each(variable: string, callback: IContextCallback) {

        let result = this.get(variable) || [],
            ctx: CONTEXT;

        if ( result && result instanceof Array ) {

            for ( let i=0, len = result.length; i<len; i++ ) {

                callback( new CONTEXT( result[i], this ) );

            }

        }

    }

    public getParent(): IContext {
        if (this.parent) {
            return this.parent;
        } else {
            throw new Error('Failed to get context parent!');
        }
    }

}