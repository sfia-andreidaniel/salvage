class Salvage {

    private static GLOBAL_HELPERS: I_SALVAGE_HELPER[] = [
        {
            name: 'upper',
            func: function (s: any): string {
                return String(s).toUpperCase();
            }
        },
        {
            name: 'lower',
            func: function (s: any): string {
                return String(s).toLowerCase();
            }
        }
    ];

    private instructions: I_SALVAGE_INSTRUCTION[];

    private helpers: I_SALVAGE_HELPER[] = [];

    private static readonly ARGUMENT_VALID_CHARS: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./_$#';

    private static readonly VAR_START_CHAR: string = '$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';

    private static readonly VAR_OTHER_CHARS: string = '$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789';

    constructor(template: string) {

        this.instructions = Salvage.tokenize(template);

        for (let i = 0, len = Salvage.GLOBAL_HELPERS.length; i < len; i++) {
            this.helpers.push(Salvage.GLOBAL_HELPERS[i]);
        }

    }

    private static createEmptyBlockText(): I_SALVAGE_BLOCK {
        return {
            token: E_SALVAGE_BLOCK_TYPE.TOKEN_TEXT,
            params: null,
            settings: null,
            text: '',
        };
    }

    private static tokenize(template: string): I_SALVAGE_INSTRUCTION[] {

        let charIndex: number = 0,
            numChars: number = template.length,
            leftChars: number = numChars - charIndex,
            block: I_SALVAGE_BLOCK = null,
            ch: string,
            readResult: I_SALVAGE_BLOCK,
            blockTextLength: number,
            blocks: I_SALVAGE_BLOCK[] = [],
            instructions: I_SALVAGE_INSTRUCTION[] = [];

        while (charIndex < numChars) {

            ch = template.charAt(charIndex);

            if ('{' === ch) {

                readResult = this.readToken(charIndex, numChars, template);

            } else {
                readResult = null;
            }

            if (!readResult) {

                block = block || Salvage.createEmptyBlockText();

                block.text += ch;
                charIndex++;
                leftChars--;
            } else {

                if (block) {
                    blocks.push(block);
                }

                // Create new block
                block = {
                    text: readResult.text,
                    token: readResult.token,
                    params: readResult.params,
                    settings: readResult.settings,
                };

                blocks.push(block);

                blockTextLength = block.text.length;

                charIndex += blockTextLength;
                leftChars -= blockTextLength;

                block = null;

            }

        }

        if (block) {
            blocks.push(block);
        }

        if (!blocks.length) {
            return [];
        }

        let currentInstruction: I_SALVAGE_INSTRUCTION,
            currentBlock: I_SALVAGE_INSTRUCTION;

        for (let i = 0, len = blocks.length; i < len; i++) {

            if (blocks[i].token === E_SALVAGE_BLOCK_TYPE.TOKEN_END) {

                if (currentBlock) {

                    currentBlock = currentBlock.getParent();

                } else {

                    throw new Error('Unexpected TOKEN END!');

                }

            } else {

                currentInstruction = this.createInstructionFromBlock(blocks[i]);

                if (currentBlock) {

                    currentBlock.append(currentInstruction);

                    currentInstruction.withParent(currentBlock);

                } else {

                    instructions.push(currentInstruction);

                    currentInstruction.withParent(null);

                }

                if (currentInstruction.allowChildren()) {
                    currentBlock = currentInstruction;
                }

            }

        }

        return instructions;

    }

    public parse(model: I_SALVAGE_MODEL): string {

        let result: string[] = [],
            context = new SALVAGE_CONTEXT(model, null, this.helpers);

        for (let i = 0, len = this.instructions.length; i < len; i++) {
            result.push(this.instructions[i].parse(context));
        }

        return result.join('');

    }

    private static readToken(startIndex: number, numChars: number, buffer: string): I_SALVAGE_BLOCK {

        if (buffer.charAt(startIndex) === '{' && buffer.charAt(startIndex + 1) === '{') {

            let isEsc: boolean = true,
                readStart: number = startIndex + 2,
                parsedArguments: string[] = [],
                endOfBlock: boolean = false,
                argument: string,
                fullMatch: string = '',
                readLength: number,
                numParsedArguments = 0,
                isFirstArgumentVariableName: boolean = false;

            if (buffer.charAt(startIndex + 2) === '{') {
                isEsc = false;
                readStart++;
                fullMatch = '{{{';
            } else {
                fullMatch = '{{';
            }

            while (!endOfBlock) {

                if (numParsedArguments >= 1 && isFirstArgumentVariableName) {

                    fullMatch += ( this.repeat(' ', readLength = this.readPipeAndSpaces(buffer, readStart)) );

                } else {

                    fullMatch += ( this.repeat(' ', readLength = this.readSpaces(buffer, readStart)) );

                }

                readStart += readLength;

                argument = this.readArgument(buffer, readStart);

                readLength = argument.length;

                if (readLength) {

                    fullMatch += argument;
                    readStart += readLength;
                    readStart += ( readLength = this.readSpaces(buffer, readStart) );
                    fullMatch += this.repeat(' ', readLength);

                    parsedArguments.push(argument);

                    numParsedArguments++;

                    if (numParsedArguments === 1) {

                        isFirstArgumentVariableName = !this.isReservedKeyword(argument);

                    }

                } else {
                    endOfBlock = true;
                }

            }

            startIndex = readStart;

            if (buffer.charAt(startIndex) === '}' && buffer.charAt(startIndex + 1) === '}') {

                fullMatch += '}}';

                if (!isEsc) {

                    if (buffer.charAt(startIndex + 2) === '}' && parsedArguments.length) {

                        fullMatch += '}';

                        /// END OF SEQUENCE
                        return this.convertArgsToToken(parsedArguments, isEsc, fullMatch);

                    } else {

                        return null;

                    }

                } else {

                    if (parsedArguments.length > 0) {
                        /// END OF SEQUENCE
                        return this.convertArgsToToken(parsedArguments, isEsc, fullMatch);

                    } else {

                        return null;

                    }

                }

            }


        } else {

            return null;

        }

    }

    private static readPipeAndSpaces(buffer: string, readStart: number): number {

        let count: number = 0,
            ch: string,
            readPipes: number = 0;

        while (ch = buffer.charAt(readStart)) {

            if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t' || ch === '|') {

                count++;

                if (ch === '|') {
                    readPipes++;
                }

                readStart++;

            } else {
                break;
            }

        }

        if (readPipes === 1) {

            return count;

        } else {

            return 0;
        }

    }


    private static readSpaces(buffer: string, readStart: number): number {

        let count: number = 0,
            ch: string;

        while (ch = buffer.charAt(readStart)) {

            if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
                count++;
                readStart++;
            } else {
                break;
            }

        }

        return count;

    }

    private static readArgument(buffer: string, readStart: number): string {

        let result: string = '',
            ch: string;

        while (ch = buffer.charAt(readStart)) {
            if (Salvage.ARGUMENT_VALID_CHARS.indexOf(ch) > -1) {
                result += ch;
                readStart++;
            } else {
                break;
            }
        }

        return result;

    }

    private static convertArgsToToken(args: string[], isEsc: boolean, fullMatch: string): I_SALVAGE_BLOCK {

        let argsLength: number = args.length;

        if (0 === argsLength) {

            return null;

        } else {

            if (argsLength === 1) {

                if (!this.isReservedKeyword(args[0])) {

                    return {
                        text: fullMatch,
                        params: args,
                        token: E_SALVAGE_BLOCK_TYPE.TOKEN_VAR,
                        settings: {
                            escaped: isEsc,
                        }
                    };

                }

                if (args[0] === '#end' || args[0] === '#else') {
                    return {
                        text: fullMatch,
                        params: null,
                        token: args[0] === '#end'
                            ? E_SALVAGE_BLOCK_TYPE.TOKEN_END
                            : E_SALVAGE_BLOCK_TYPE.TOKEN_ELSE,
                        settings: null,
                    };

                }

                return null;

            } else {

                if (!this.isReservedKeyword(args[0])) {

                    return {
                        text: fullMatch,
                        params: args,
                        token: E_SALVAGE_BLOCK_TYPE.TOKEN_VAR,
                        settings: {
                            escaped: isEsc
                        }
                    };

                }

                if (!isEsc) {
                    return null;
                }

                switch (args[0]) {

                    case '#if':
                    case '#unless':

                        if (argsLength === 2 && this.isValidContextPath(args[1])) {

                            return {
                                token: args[0] === '#if'
                                    ? E_SALVAGE_BLOCK_TYPE.TOKEN_IF
                                    : E_SALVAGE_BLOCK_TYPE.TOKEN_UNLESS,
                                params: [args[1]],
                                text: fullMatch,
                                settings: {
                                    negated: args[0] === '#unless',
                                },
                            };

                        }

                        return null;

                    case '#each':

                        if (argsLength === 2 && this.isValidContextPath(args[1])) {

                            return {
                                token: E_SALVAGE_BLOCK_TYPE.TOKEN_EACH,
                                params: [args[1]],
                                text: fullMatch,
                                settings: null,
                            };

                        } else {

                            if (argsLength === 4 && args[2] === 'in' && this.isValidContextPath(args[1]) && this.isValidVariableName(args[3])) {

                                return {
                                    token: E_SALVAGE_BLOCK_TYPE.TOKEN_EACH,
                                    params: [args[1], args[3]],
                                    text: fullMatch,
                                    settings: null,
                                }

                            }

                        }

                        return null;

                    case '#with':

                        if (argsLength === 2) {

                            if (this.isValidContextPath(args[1])) {

                                return {
                                    token: E_SALVAGE_BLOCK_TYPE.TOKEN_WITH,
                                    params: [args[1]],
                                    text: fullMatch,
                                    settings: null,
                                };

                            }

                        }

                        return null;

                    default:

                        throw new Error('Invalid keyword: ' + args[0]);
                }

            }

        }
    }

    private static isReservedKeyword(string: string): boolean {

        return string === '#if' || string === '#each' || string === '#unless' || string === '#else' || string === '#end' || string === '#with';

    }

    private static isValidContextPath(string: string): boolean {

        if (!string) {
            return false;
        }

        let segments: string[] = string.split('/');

        for (let i = 0, len = segments.length; i < len; i++) {

            if (!( segments[i] === '.' || segments[i] === '..' || this.isValidVariableName(segments[i]) )) {
                return false;
            }
        }

        return true;
    }

    private static isValidVariableName(string: string): boolean {

        if (!string) {

            return false;

        } else {

            let segments: string[] = string.split('.');

            for (let i = 0, len = segments.length; i < len; i++) {

                if (Salvage.VAR_START_CHAR.indexOf(segments[i].charAt(0)) > -1) {

                    for (let j = 1, n = segments[i].length; j < n; j++) {
                        if (Salvage.VAR_OTHER_CHARS.indexOf(segments[i].charAt(j)) === -1) {
                            return false;
                        }
                    }

                } else {

                    return false;

                }

            }

            return true;
        }
    }

    private static repeat(ch: string, len: number): string {
        let result: string = '';
        for (let i = 0; i < len; i++) {
            result = result + ch;
        }
        return result;
    }

    private static createInstructionFromBlock(block: I_SALVAGE_BLOCK): I_SALVAGE_INSTRUCTION {

        switch (block.token) {

            case E_SALVAGE_BLOCK_TYPE.TOKEN_IF:
                return new SALVAGE_INSTRUCTION_IF(block.params);

            case E_SALVAGE_BLOCK_TYPE.TOKEN_UNLESS:
                return new SALVAGE_UNLESS(block.params);

            case E_SALVAGE_BLOCK_TYPE.TOKEN_END:
                return new SALVAGE_INSTRUCTION_END();

            case E_SALVAGE_BLOCK_TYPE.TOKEN_TEXT:
                return new SALVAGE_TEXT(block.text);

            case E_SALVAGE_BLOCK_TYPE.TOKEN_VAR:
                return new SALVAGE_BLOCK_VAR(block.params, block.settings.escaped);

            case E_SALVAGE_BLOCK_TYPE.TOKEN_EACH:
                return new SALVAGE_INSTRUCTION_EACH(block.params);

            case E_SALVAGE_BLOCK_TYPE.TOKEN_WITH:
                return new SALVAGE_BLOCK_WITH(block.params);

            case E_SALVAGE_BLOCK_TYPE.TOKEN_ELSE:
                return new SALVAGE_INSTRUCTION_ELSE();

            default:
                throw new Error('Unknown block type: ' + JSON.stringify(block));
        }

    }

    public static normalizePath(path: string): string {

        if (!path) {

            return path;

        } else {

            let segments: string[] = path.split('/'),
                result: string[] = [],
                resultLength: number = 0,
                subSegments: string[];

            for (let i = 0, len = segments.length; i < len; i++) {

                if ('.' !== segments[i] && '' !== segments[i]) {

                    if ('..' === segments[i]) {

                        if (resultLength > 0) {

                            resultLength--;
                            result.pop();

                        } else {

                            resultLength++;
                            result.push('..');

                        }

                    } else {

                        subSegments = segments[i].split('.');

                        for (let j = 0, n = subSegments.length; j < n; j++) {

                            if ('' === subSegments[j]) {

                                return null;

                            } else {

                                result.push(subSegments[j]);

                                resultLength++;

                            }

                        }

                    }

                }

            }

            for (let i = resultLength - 1; i > -1; i--) {

                if (result[i] === 'this' && i > 1 ) {

                    result.splice(i, 1);
                    resultLength--;

                }

            }

            return resultLength
                ? result.join('/')
                : null;

        }

    }

    public static addHelper( helper: I_SALVAGE_HELPER ) {

        if ( !helper ) {
            throw new Error('Invalid argument!');
        }

        for ( let i=0, len = this.GLOBAL_HELPERS.length; i<len; i++ ) {
            if ( this.GLOBAL_HELPERS[i].name === helper.name ) {
                throw new Error('Helper "' + helper.name + '" already added!');
            }
        }

        this.GLOBAL_HELPERS.push( helper );

    }

    public withHelper( helper: I_SALVAGE_HELPER ): this {

        if ( !helper ) {
            throw new Error('Invalid argument!');
        }

        for ( let i=0, len = this.helpers.length; i<len; i++ ) {
            if ( this.helpers[i].name === helper.name ) {
                throw new Error('Helper "' + helper.name + '" already added!');
            }
        }

        this.helpers.push( helper );

        return this;

    }
}