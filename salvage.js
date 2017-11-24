var ESalvageBlockType;
(function (ESalvageBlockType) {
    ESalvageBlockType[ESalvageBlockType["TOKEN_VAR"] = 0] = "TOKEN_VAR";
    ESalvageBlockType[ESalvageBlockType["TOKEN_IF"] = 1] = "TOKEN_IF";
    ESalvageBlockType[ESalvageBlockType["TOKEN_ELSE"] = 2] = "TOKEN_ELSE";
    ESalvageBlockType[ESalvageBlockType["TOKEN_UNLESS"] = 3] = "TOKEN_UNLESS";
    ESalvageBlockType[ESalvageBlockType["TOKEN_EACH"] = 4] = "TOKEN_EACH";
    ESalvageBlockType[ESalvageBlockType["TOKEN_END"] = 5] = "TOKEN_END";
    ESalvageBlockType[ESalvageBlockType["TOKEN_TEXT"] = 6] = "TOKEN_TEXT";
    ESalvageBlockType[ESalvageBlockType["TOKEN_COMMENT"] = 7] = "TOKEN_COMMENT";
})(ESalvageBlockType || (ESalvageBlockType = {}));
var Salvage = (function () {
    function Salvage(template) {
        this.instructions = Salvage.tokenize(template);
    }
    Salvage.createEmptyBlockText = function () {
        return {
            token: ESalvageBlockType.TOKEN_TEXT,
            params: null,
            settings: null,
            text: '',
        };
    };
    Salvage.tokenize = function (template) {
        console.time('tokenize');
        var charIndex = 0, numChars = template.length, leftChars = numChars - charIndex, block = null, ch, readResult, blockTextLength, blocks = [], instructions = [];
        while (charIndex < numChars) {
            ch = template.charAt(charIndex);
            if ('{' === ch) {
                readResult = this.readToken(charIndex, numChars, template);
            }
            else {
                readResult = null;
            }
            if (!readResult) {
                block = block || Salvage.createEmptyBlockText();
                block.text += ch;
                charIndex++;
                leftChars--;
            }
            else {
                if (block) {
                    blocks.push(block);
                }
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
        var pointer, pointerParent;
        instructions.push(pointer = this.createInstructionFromBlock(blocks[0]));
        for (var i = 1, len = blocks.length; i < len; i++) {
            if (null == pointer) {
                instructions.push(pointer = this.createInstructionFromBlock(blocks[i]));
            }
            else {
                if (pointer.allowChildren()) {
                    pointer = pointer.append(this.createInstructionFromBlock(blocks[i]));
                }
                else {
                    pointerParent = pointer.getParent();
                    if (null === pointerParent) {
                        instructions.push(pointer = this.createInstructionFromBlock(blocks[i]));
                    }
                    else {
                        pointer = pointerParent;
                        pointer = pointer.append(this.createInstructionFromBlock(blocks[i]));
                    }
                }
            }
        }
        console.log(instructions);
        console.timeEnd('tokenize');
        return instructions;
    };
    Salvage.prototype.parse = function (model) {
        var result = [], context = new CONTEXT(model);
        for (var i = 0, len = this.instructions.length; i < len; i++) {
            result.push(this.instructions[i].parse(context));
        }
        return result.join('');
    };
    Salvage.readToken = function (startIndex, numChars, buffer) {
        if (buffer.charAt(startIndex) === '{' && buffer.charAt(startIndex + 1) === '{') {
            var isEsc = false, readStart = startIndex + 2, parsedArguments = [], endOfBlock = false, argument = void 0, fullMatch = '', readLength = void 0;
            if (buffer.charAt(startIndex + 2) === '{') {
                isEsc = true;
                readStart++;
                fullMatch = '{{{';
            }
            else {
                fullMatch = '{{';
            }
            while (!endOfBlock) {
                fullMatch += (this.repeat(' ', readLength = this.readSpaces(buffer, readStart)));
                readStart += readLength;
                argument = this.readArgument(buffer, readStart);
                readLength = argument.length;
                if (readLength) {
                    fullMatch += argument;
                    readStart += readLength;
                    readStart += (readLength = this.readSpaces(buffer, readStart));
                    fullMatch += this.repeat(' ', readLength);
                    parsedArguments.push(argument);
                }
                else {
                    endOfBlock = true;
                }
            }
            startIndex = readStart;
            if (buffer.charAt(startIndex) === '}' && buffer.charAt(startIndex + 1) === '}') {
                fullMatch += '}}';
                if (isEsc) {
                    if (buffer.charAt(startIndex + 2) === '}' && parsedArguments.length) {
                        fullMatch += '}';
                        return this.convertArgsToToken(parsedArguments, isEsc, fullMatch);
                    }
                    else {
                        return null;
                    }
                }
                else {
                    if (parsedArguments.length > 0) {
                        return this.convertArgsToToken(parsedArguments, isEsc, fullMatch);
                    }
                    else {
                        return null;
                    }
                }
            }
        }
        else {
            return null;
        }
    };
    Salvage.readSpaces = function (buffer, readStart) {
        var count = 0, ch;
        while (ch = buffer.charAt(readStart)) {
            if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
                count++;
                readStart++;
            }
            else {
                break;
            }
        }
        return count;
    };
    Salvage.readArgument = function (buffer, readStart) {
        var result = '', ch;
        while (ch = buffer.charAt(readStart)) {
            if (Salvage.ARGUMENT_VALID_CHARS.indexOf(ch) > -1) {
                result += ch;
                readStart++;
            }
            else {
                break;
            }
        }
        return result;
    };
    Salvage.convertArgsToToken = function (args, isEsc, fullMatch) {
        var argsLength = args.length;
        if (0 === argsLength) {
            return null;
        }
        else {
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
            }
            else {
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
                        }
                        else {
                            if (argsLength === 4 && args[2] === 'in' && this.isValidContextPath(args[1]) && this.isValidVariableName(args[3])) {
                                return {
                                    token: ESalvageBlockType.TOKEN_EACH,
                                    params: [args[1], args[3]],
                                    text: fullMatch,
                                    settings: null,
                                };
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
    };
    Salvage.isReservedKeyword = function (string) {
        return string === '#if' || string === '#each' || string === '#unless' || string === '#else' || string === '#end';
    };
    Salvage.isValidContextPath = function (string) {
        if (!string) {
            return false;
        }
        var segments = string.split('/');
        for (var i = 0, len = segments.length; i < len; i++) {
            if (!(segments[i] === '.' || segments[i] === '..' || this.isValidVariableName(segments[i]))) {
                return false;
            }
        }
        return true;
    };
    Salvage.isValidVariableName = function (string) {
        if (!string) {
            return false;
        }
        else {
            if (Salvage.VAR_START_CHAR.indexOf(string.charAt(0))) {
                for (var i = 1, len = string.length; i < len; i++) {
                    if (Salvage.VAR_OTHER_CHARS.indexOf(string.charAt(i)) === -1) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
    };
    Salvage.repeat = function (ch, len) {
        var result = '';
        for (var i = 0; i < len; i++) {
            result = result + ch;
        }
        return result;
    };
    Salvage.createInstructionFromBlock = function (block) {
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
    };
    Salvage.ARGUMENT_VALID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./_$#|';
    Salvage.VAR_START_CHAR = '$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
    Salvage.VAR_OTHER_CHARS = '$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789';
    return Salvage;
}());
var CONTEXT = (function () {
    function CONTEXT(model, parent) {
        this.parent = null;
        this.model = model;
        this.parent = parent || null;
    }
    CONTEXT.prototype.get = function (variable) {
        return this.model && this.model[variable]
            ? this.model[variable]
            : null;
    };
    CONTEXT.prototype.cd = function (path) {
        var segments = path.split('/'), cursor = this;
        for (var i = 0, len = segments.length; i < len; i++) {
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
                        return new CONTEXT(this.model[segments[i]], this);
                    }
                    else {
                        throw new Error('Failed to create model from segment: ' + segments.slice(i).join('/'));
                    }
            }
        }
    };
    CONTEXT.prototype.each = function (variable, callback) {
        var result = this.get(variable) || [], ctx;
        if (result && result instanceof Array) {
            for (var i = 0, len = result.length; i < len; i++) {
                callback(new CONTEXT(result[i], this));
            }
        }
    };
    CONTEXT.prototype.getParent = function () {
        if (this.parent) {
            return this.parent;
        }
        else {
            throw new Error('Failed to get context parent!');
        }
    };
    return CONTEXT;
}());
var Instruction = (function () {
    function Instruction(type, params) {
        this.parent = null;
        this.type = type;
        this.params = params;
    }
    Instruction.prototype.withParent = function (parent) {
        this.parent = parent;
        return this;
    };
    Instruction.prototype.getParent = function () {
        return this.parent;
    };
    Instruction.prototype.getBlockType = function () {
        return this.type;
    };
    Instruction.prototype.getParam = function (index) {
        return this.params
            ? this.params[index] || null
            : null;
    };
    return Instruction;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var IF = (function (_super) {
    __extends(IF, _super);
    function IF(params) {
        var _this = _super.call(this, ESalvageBlockType.TOKEN_IF, params) || this;
        _this.elseAppended = false;
        _this.trueBranchChildren = [];
        _this.falseBranchChildren = [];
        return _this;
    }
    IF.prototype.append = function (instruction) {
        if (instruction.getBlockType() === ESalvageBlockType.TOKEN_ELSE) {
            if (this.elseAppended) {
                throw new Error('Else appended!');
            }
            else {
                this.elseAppended = true;
            }
            return this;
        }
        else {
            if (instruction.getBlockType() === ESalvageBlockType.TOKEN_END) {
                return this.getParent();
            }
            else {
                instruction.withParent(this);
                if (this.elseAppended) {
                    this.falseBranchChildren.push(instruction.withParent(this));
                }
                else {
                    this.trueBranchChildren.push(instruction.withParent(this));
                }
                return instruction.allowChildren()
                    ? instruction
                    : this;
            }
        }
    };
    IF.prototype.allowChildren = function () {
        return true;
    };
    IF.prototype.parse = function (context) {
        var result = '';
        if (context.get(this.getParam(0))) {
            for (var i = 0, len = this.trueBranchChildren.length; i < len; i++) {
                result = result.concat(this.trueBranchChildren[i].parse(context));
            }
        }
        else {
            for (var i = 0, len = this.falseBranchChildren.length; i < len; i++) {
                result = result.concat(this.falseBranchChildren[i].parse(context));
            }
        }
        return result;
    };
    return IF;
}(Instruction));
var END = (function (_super) {
    __extends(END, _super);
    function END() {
        return _super.call(this, ESalvageBlockType.TOKEN_END, null) || this;
    }
    END.prototype.allowChildren = function () {
        return false;
    };
    END.prototype.parse = function (context) {
        return '';
    };
    END.prototype.append = function (instruction) {
        throw new Error('Cannot append something into a END block!');
    };
    return END;
}(Instruction));
var UNLESS = (function (_super) {
    __extends(UNLESS, _super);
    function UNLESS(params) {
        var _this = _super.call(this, ESalvageBlockType.TOKEN_UNLESS, params) || this;
        _this.elseAppended = false;
        _this.trueBranchChildren = [];
        _this.falseBranchChildren = [];
        return _this;
    }
    UNLESS.prototype.append = function (instruction) {
        if (instruction.getBlockType() === ESalvageBlockType.TOKEN_ELSE) {
            if (this.elseAppended) {
                throw new Error('Else appended!');
            }
            else {
                this.elseAppended = true;
            }
            return this;
        }
        else {
            if (instruction.getBlockType() === ESalvageBlockType.TOKEN_END) {
                return this.getParent();
            }
            else {
                instruction.withParent(this);
                if (this.elseAppended) {
                    this.falseBranchChildren.push(instruction);
                }
                else {
                    this.trueBranchChildren.push(instruction);
                }
                return instruction.allowChildren()
                    ? instruction
                    : this;
            }
        }
    };
    UNLESS.prototype.allowChildren = function () {
        return true;
    };
    UNLESS.prototype.parse = function (context) {
        var result = '';
        if (!context.get(this.getParam(0))) {
            for (var i = 0, len = this.trueBranchChildren.length; i < len; i++) {
                result = result.concat(this.trueBranchChildren[i].parse(context));
            }
        }
        else {
            for (var i = 0, len = this.falseBranchChildren.length; i < len; i++) {
                result = result.concat(this.falseBranchChildren[i].parse(context));
            }
        }
        return result;
    };
    return UNLESS;
}(Instruction));
var TEXT = (function (_super) {
    __extends(TEXT, _super);
    function TEXT(text) {
        var _this = _super.call(this, ESalvageBlockType.TOKEN_TEXT, null) || this;
        _this.text = text;
        return _this;
    }
    TEXT.prototype.allowChildren = function () {
        return false;
    };
    TEXT.prototype.parse = function (context) {
        return this.text;
    };
    TEXT.prototype.append = function (instruction) {
        throw new Error("Method not allowed.");
    };
    return TEXT;
}(Instruction));
var VAR = (function (_super) {
    __extends(VAR, _super);
    function VAR(params, isEscaped) {
        var _this = _super.call(this, ESalvageBlockType.TOKEN_VAR, params) || this;
        _this.isEscaped = isEscaped;
        return _this;
    }
    VAR.prototype.allowChildren = function () {
        return false;
    };
    VAR.prototype.parse = function (context) {
        return context.get(this.getParam(0));
    };
    VAR.prototype.append = function (instruction) {
        throw new Error('A VAR block does not allow insertion');
    };
    return VAR;
}(Instruction));
var EACH = (function (_super) {
    __extends(EACH, _super);
    function EACH(params) {
        var _this = _super.call(this, ESalvageBlockType.TOKEN_EACH, params) || this;
        _this.children = [];
        return _this;
    }
    EACH.prototype.allowChildren = function () {
        return true;
    };
    EACH.prototype.parse = function (context) {
        var result = '';
        (function (self) {
            context.each(this.getParam(0), function (item) {
                for (var i = 0, len = self.children.length; i < len; i++) {
                    result = result.concat(self.children[i].parse(item));
                }
            });
        })(this);
        return result;
    };
    EACH.prototype.append = function (instruction) {
        if (instruction.getBlockType() === ESalvageBlockType.TOKEN_END) {
            return this.getParent();
        }
        else {
            this.children.push(instruction.withParent(this));
            return instruction.allowChildren()
                ? instruction
                : this;
        }
    };
    return EACH;
}(Instruction));
var ELSE = (function (_super) {
    __extends(ELSE, _super);
    function ELSE() {
        return _super.call(this, ESalvageBlockType.TOKEN_ELSE, null) || this;
    }
    ELSE.prototype.allowChildren = function () {
        return false;
    };
    ELSE.prototype.parse = function (context) {
        throw new Error("Should never be parsed");
    };
    ELSE.prototype.append = function (instruction) {
        throw new Error("Cannot have children");
    };
    return ELSE;
}(Instruction));
