class Salvage {

    private instructions: IInstruction[];

    private static readonly ARGUMENT_VALID_CHARS: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./_$#|';

    private static readonly VAR_START_CHAR: string = '$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';

    private static readonly VAR_OTHER_CHARS: string = '$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789';

    constructor(template: string) {
        this.instructions = Salvage.tokenize(template);
    }

    private static createEmptyBlockText(): ISalvageBlock {
        return {
            token: ESalvageBlockType.TOKEN_TEXT,
            params: null,
            settings: null,
            text: '',
        };
    }

    private static tokenize(template: string): IInstruction[] {

        console.time('tokenize');

        let charIndex: number = 0,
            numChars: number = template.length,
            leftChars: number = numChars - charIndex,
            block: ISalvageBlock = null,
            ch: string,
            readResult: ISalvageBlock,
            blockTextLength: number,
            blocks: ISalvageBlock[] = [],
            instructions: IInstruction[] = [];

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

        let pointer: IInstruction,
            pointerParent: IInstruction;

        instructions.push(pointer = this.createInstructionFromBlock(blocks[0]));

        for (let i = 1, len = blocks.length; i < len; i++) {

            if ( null == pointer ) {

                instructions.push( pointer = this.createInstructionFromBlock(blocks[i]) );

            } else {

                if (pointer.allowChildren()) {

                    pointer = pointer.append(this.createInstructionFromBlock(blocks[i]));

                } else {

                    pointerParent = pointer.getParent();

                    if (null === pointerParent) {
                        instructions.push(pointer = this.createInstructionFromBlock(blocks[i]));
                    } else {
                        pointer = pointerParent;
                        pointer = pointer.append(this.createInstructionFromBlock(blocks[i]));
                    }
                }

            }

        }

        console.log( instructions );

        console.timeEnd('tokenize');

        return instructions;

    }

    public parse(model: ISalvageModel): string {

        let result: string[] = [],
            context = new CONTEXT(model);

        for (let i = 0, len = this.instructions.length; i < len; i++) {
            result.push(this.instructions[i].parse(context));
        }

        return result.join('');

    }

    private static readToken(startIndex: number, numChars: number, buffer: string): ISalvageBlock {

        if (buffer.charAt(startIndex) === '{' && buffer.charAt(startIndex + 1) === '{') {

            let isEsc: boolean = false,
                readStart: number = startIndex + 2,
                parsedArguments: string[] = [],
                endOfBlock: boolean = false,
                argument: string,
                fullMatch: string = '',
                readLength: number;

            if (buffer.charAt(startIndex + 2) === '{') {
                isEsc = true;
                readStart++;
                fullMatch = '{{{';
            } else {
                fullMatch = '{{';
            }

            while (!endOfBlock) {

                fullMatch += ( this.repeat(' ', readLength = this.readSpaces(buffer, readStart)) );

                readStart += readLength;

                argument = this.readArgument(buffer, readStart);

                readLength = argument.length;

                if (readLength) {
                    fullMatch += argument;
                    readStart += readLength;
                    readStart += ( readLength = this.readSpaces(buffer, readStart) );
                    fullMatch += this.repeat(' ', readLength);
                    parsedArguments.push(argument);
                } else {
                    endOfBlock = true;
                }

            }

            startIndex = readStart;

            if (buffer.charAt(startIndex) === '}' && buffer.charAt(startIndex + 1) === '}') {

                fullMatch += '}}';

                if (isEsc) {

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

    private static readSpaces(buffer: string, readStart: number) {

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

    private static convertArgsToToken(args: string[], isEsc: boolean, fullMatch: string): ISalvageBlock {

        let argsLength: number = args.length;

        if (0 === argsLength) {

            return null;

        } else {

            if (argsLength === 1) {

                if (!this.isReservedKeyword(args[0])) {

                    return {
                        text: fullMatch,
                        params: args,
                        token: ESalvageBlockType.TOKEN_VAR,
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
                            ? ESalvageBlockType.TOKEN_END
                            : ESalvageBlockType.TOKEN_ELSE,
                        settings: null,
                    };

                }

                return null;

            } else {

                if (!this.isReservedKeyword(args[0])) {

                    return null;

                }

                if (isEsc) {
                    return null;
                }

                switch (args[0]) {

                    case '#if':
                    case '#unless':

                        if (argsLength === 2 && this.isValidContextPath(args[1])) {

                            return {
                                token: ESalvageBlockType.TOKEN_IF,
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
                                token: ESalvageBlockType.TOKEN_EACH,
                                params: [args[1]],
                                text: fullMatch,
                                settings: null,
                            };

                        } else {

                            if (argsLength === 4 && args[2] === 'in' && this.isValidContextPath(args[1]) && this.isValidVariableName(args[3])) {

                                return {
                                    token: ESalvageBlockType.TOKEN_EACH,
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
                                    token: ESalvageBlockType.TOKEN_UNLESS,
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

        return string === '#if' || string === '#each' || string === '#unless' || string === '#else' || string === '#end';

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

            if (Salvage.VAR_START_CHAR.indexOf(string.charAt(0))) {

                for (let i = 1, len = string.length; i < len; i++) {
                    if (Salvage.VAR_OTHER_CHARS.indexOf(string.charAt(i)) === -1) {
                        return false;
                    }
                }

                return true;

            }

            return false;
        }
    }

    private static repeat(ch: string, len: number): string {
        let result: string = '';
        for (let i = 0; i < len; i++) {
            result = result + ch;
        }
        return result;
    }

    private static createInstructionFromBlock(block: ISalvageBlock): IInstruction {

        switch (block.token) {

            case ESalvageBlockType.TOKEN_IF:
                return new IF(block.params);

            case ESalvageBlockType.TOKEN_UNLESS:
                return new UNLESS(block.params);

            case ESalvageBlockType.TOKEN_END:
                return new END();

            case ESalvageBlockType.TOKEN_TEXT:
                return new TEXT(block.text);

            case ESalvageBlockType.TOKEN_VAR:
                return new VAR(block.params, block.settings.escaped);

            case ESalvageBlockType.TOKEN_EACH:
                return new EACH(block.params);

            case ESalvageBlockType.TOKEN_ELSE:
                return new ELSE();

            default:
                throw new Error('Unknown block type: ' + JSON.stringify(block));
        }

    }
}