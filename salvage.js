var E_SALVAGE_BLOCK_TYPE;
(function (E_SALVAGE_BLOCK_TYPE) {
    E_SALVAGE_BLOCK_TYPE[E_SALVAGE_BLOCK_TYPE["TOKEN_VAR"] = 0] = "TOKEN_VAR";
    E_SALVAGE_BLOCK_TYPE[E_SALVAGE_BLOCK_TYPE["TOKEN_IF"] = 1] = "TOKEN_IF";
    E_SALVAGE_BLOCK_TYPE[E_SALVAGE_BLOCK_TYPE["TOKEN_ELSE"] = 2] = "TOKEN_ELSE";
    E_SALVAGE_BLOCK_TYPE[E_SALVAGE_BLOCK_TYPE["TOKEN_UNLESS"] = 3] = "TOKEN_UNLESS";
    E_SALVAGE_BLOCK_TYPE[E_SALVAGE_BLOCK_TYPE["TOKEN_EACH"] = 4] = "TOKEN_EACH";
    E_SALVAGE_BLOCK_TYPE[E_SALVAGE_BLOCK_TYPE["TOKEN_END"] = 5] = "TOKEN_END";
    E_SALVAGE_BLOCK_TYPE[E_SALVAGE_BLOCK_TYPE["TOKEN_TEXT"] = 6] = "TOKEN_TEXT";
    E_SALVAGE_BLOCK_TYPE[E_SALVAGE_BLOCK_TYPE["TOKEN_WITH"] = 7] = "TOKEN_WITH";
    E_SALVAGE_BLOCK_TYPE[E_SALVAGE_BLOCK_TYPE["TOKEN_COMMENT"] = 8] = "TOKEN_COMMENT";
})(E_SALVAGE_BLOCK_TYPE || (E_SALVAGE_BLOCK_TYPE = {}));
var Salvage = (function () {
    function Salvage(template) {
        this.helpers = [];
        this.instructions = Salvage.tokenize(template);
        for (var i = 0, len = Salvage.GLOBAL_HELPERS.length; i < len; i++) {
            this.helpers.push(Salvage.GLOBAL_HELPERS[i]);
        }
    }
    Salvage.createEmptyBlockText = function () {
        return {
            token: E_SALVAGE_BLOCK_TYPE.TOKEN_TEXT,
            params: null,
            settings: null,
            text: '',
        };
    };
    Salvage.tokenize = function (template) {
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
        var currentInstruction, currentBlock;
        for (var i = 0, len = blocks.length; i < len; i++) {
            if (blocks[i].token === E_SALVAGE_BLOCK_TYPE.TOKEN_END) {
                if (currentBlock) {
                    currentBlock = currentBlock.getParent();
                }
                else {
                    throw new Error('Unexpected TOKEN END!');
                }
            }
            else {
                currentInstruction = this.createInstructionFromBlock(blocks[i]);
                if (currentBlock) {
                    currentBlock.append(currentInstruction);
                    currentInstruction.withParent(currentBlock);
                }
                else {
                    instructions.push(currentInstruction);
                    currentInstruction.withParent(null);
                }
                if (currentInstruction.allowChildren()) {
                    currentBlock = currentInstruction;
                }
            }
        }
        return instructions;
    };
    Salvage.prototype.parse = function (model) {
        var result = [], context = new SALVAGE_CONTEXT(model, null, this.helpers);
        for (var i = 0, len = this.instructions.length; i < len; i++) {
            result.push(this.instructions[i].parse(context));
        }
        window['mo'] = context;
        return result.join('');
    };
    Salvage.readToken = function (startIndex, numChars, buffer) {
        if (buffer.charAt(startIndex) === '{' && buffer.charAt(startIndex + 1) === '{') {
            var isEsc = false, readStart = startIndex + 2, parsedArguments = [], endOfBlock = false, argument = void 0, fullMatch = '', readLength = void 0, numParsedArguments = 0, isFirstArgumentVariableName = false;
            if (buffer.charAt(startIndex + 2) === '{') {
                isEsc = true;
                readStart++;
                fullMatch = '{{{';
            }
            else {
                fullMatch = '{{';
            }
            while (!endOfBlock) {
                if (numParsedArguments >= 1 && isFirstArgumentVariableName) {
                    fullMatch += (this.repeat(' ', readLength = this.readPipeAndSpaces(buffer, readStart)));
                }
                else {
                    fullMatch += (this.repeat(' ', readLength = this.readSpaces(buffer, readStart)));
                }
                readStart += readLength;
                argument = this.readArgument(buffer, readStart);
                readLength = argument.length;
                if (readLength) {
                    fullMatch += argument;
                    readStart += readLength;
                    readStart += (readLength = this.readSpaces(buffer, readStart));
                    fullMatch += this.repeat(' ', readLength);
                    parsedArguments.push(argument);
                    numParsedArguments++;
                    if (numParsedArguments === 1) {
                        isFirstArgumentVariableName = !this.isReservedKeyword(argument);
                    }
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
    Salvage.readPipeAndSpaces = function (buffer, readStart) {
        var count = 0, ch, readPipes = 0;
        while (ch = buffer.charAt(readStart)) {
            if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t' || ch === '|') {
                count++;
                if (ch === '|') {
                    readPipes++;
                }
                readStart++;
            }
            else {
                break;
            }
        }
        if (readPipes === 1) {
            return count;
        }
        else {
            return 0;
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
            }
            else {
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
                if (isEsc) {
                    return null;
                }
                switch (args[0]) {
                    case '#if':
                    case '#unless':
                        if (argsLength === 2 && this.isValidContextPath(args[1])) {
                            return {
                                token: E_SALVAGE_BLOCK_TYPE.TOKEN_IF,
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
                        }
                        else {
                            if (argsLength === 4 && args[2] === 'in' && this.isValidContextPath(args[1]) && this.isValidVariableName(args[3])) {
                                return {
                                    token: E_SALVAGE_BLOCK_TYPE.TOKEN_EACH,
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
    };
    Salvage.isReservedKeyword = function (string) {
        return string === '#if' || string === '#each' || string === '#unless' || string === '#else' || string === '#end' || string === '#with';
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
            var segments = string.split('.');
            for (var i = 0, len = segments.length; i < len; i++) {
                if (Salvage.VAR_START_CHAR.indexOf(segments[i].charAt(0)) > -1) {
                    for (var j = 1, n = segments[i].length; j < n; j++) {
                        if (Salvage.VAR_OTHER_CHARS.indexOf(segments[i].charAt(j)) === -1) {
                            return false;
                        }
                    }
                }
                else {
                    return false;
                }
            }
            return true;
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
    };
    Salvage.normalizePath = function (path) {
        if (!path) {
            return path;
        }
        else {
            var segments = path.split('/'), result = [], resultLength = 0, subSegments = void 0;
            for (var i = 0, len = segments.length; i < len; i++) {
                if ('.' !== segments[i] && '' !== segments[i]) {
                    if ('..' === segments[i]) {
                        if (resultLength > 0) {
                            resultLength--;
                            result.pop();
                        }
                        else {
                            resultLength++;
                            result.push('..');
                        }
                    }
                    else {
                        subSegments = segments[i].split('.');
                        for (var j = 0, n = subSegments.length; j < n; j++) {
                            if ('' === subSegments[j]) {
                                return null;
                            }
                            else {
                                result.push(subSegments[j]);
                                resultLength++;
                            }
                        }
                    }
                }
            }
            for (var i = resultLength - 1; i > -1; i--) {
                if (result[i] === 'this') {
                    result.splice(i, 1);
                    resultLength--;
                }
            }
            return resultLength
                ? result.join('/')
                : null;
        }
    };
    Salvage.addHelper = function (helper) {
        if (!helper) {
            throw new Error('Invalid argument!');
        }
        for (var i = 0, len = this.GLOBAL_HELPERS.length; i < len; i++) {
            if (this.GLOBAL_HELPERS[i].name === helper.name) {
                throw new Error('Helper "' + helper.name + '" already added!');
            }
        }
        this.GLOBAL_HELPERS.push(helper);
    };
    Salvage.prototype.withHelper = function (helper) {
        if (!helper) {
            throw new Error('Invalid argument!');
        }
        for (var i = 0, len = this.helpers.length; i < len; i++) {
            if (this.helpers[i].name === helper.name) {
                throw new Error('Helper "' + helper.name + '" already added!');
            }
        }
        this.helpers.push(helper);
        return this;
    };
    Salvage.GLOBAL_HELPERS = [
        {
            name: 'upper',
            func: function (s) {
                return String(s).toUpperCase();
            }
        },
        {
            name: 'lower',
            func: function (s) {
                return String(s).toLowerCase();
            }
        }
    ];
    Salvage.ARGUMENT_VALID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./_$#|';
    Salvage.VAR_START_CHAR = '$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
    Salvage.VAR_OTHER_CHARS = '$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789';
    return Salvage;
}());
var SALVAGE_CONTEXT = (function () {
    function SALVAGE_CONTEXT(model, parent, helpers) {
        this.parent = null;
        this.model = model;
        this.parent = parent || null;
        this.helpers = helpers || [];
    }
    SALVAGE_CONTEXT.prototype.getModel = function () {
        return this.model;
    };
    SALVAGE_CONTEXT.prototype.get = function (variable) {
        var segments = variable.split('/'), numSegments = segments.length;
        if (numSegments > 1) {
            return this.cd(segments.slice(0, numSegments - 1).join('/')).get(segments[numSegments - 1]);
        }
        else {
            if (segments[0] == '..') {
                return this.getParent().getModel();
            }
            else {
                return this.model[segments[0]] || null;
            }
        }
    };
    SALVAGE_CONTEXT.prototype.getHelper = function (name) {
        for (var i = 0, len = this.helpers.length; i < len; i++) {
            if (this.helpers[i].name === name) {
                return this.helpers[i];
            }
        }
        throw new Error('HELPER "' + name + '" not found!');
    };
    SALVAGE_CONTEXT.prototype.isNotEmpty = function (variable) {
        var result = this.get(variable);
        if (!result) {
            return false;
        }
        else {
            if (result instanceof Array && result.length === 0) {
                return false;
            }
            return true;
        }
    };
    SALVAGE_CONTEXT.prototype.cd = function (path) {
        var segments = path.split('/');
        if (segments.length === 1) {
            return new SALVAGE_CONTEXT(this.get(segments[0]) || {}, this, this.helpers);
        }
        else {
            return new SALVAGE_CONTEXT(this.get(segments[0]) || {}, this, this.helpers).cd(segments.slice(1).join('/'));
        }
    };
    SALVAGE_CONTEXT.prototype.each = function (variable, callback) {
        var result = this.get(variable) || [];
        if (result && result instanceof Array) {
            for (var i = 0, len = result.length; i < len; i++) {
                callback(new SALVAGE_CONTEXT(result[i], this, this.helpers));
            }
        }
    };
    SALVAGE_CONTEXT.prototype.getParent = function () {
        if (this.parent) {
            return this.parent;
        }
        else {
            throw new Error('Failed to get context parent!');
        }
    };
    return SALVAGE_CONTEXT;
}());
var SALVAGE_ABSTRACT_INSTRUCTION = (function () {
    function SALVAGE_ABSTRACT_INSTRUCTION(type, params) {
        this.parent = null;
        this.type = type;
        this.params = params;
    }
    SALVAGE_ABSTRACT_INSTRUCTION.prototype.withParent = function (parent) {
        this.parent = parent;
        return this;
    };
    SALVAGE_ABSTRACT_INSTRUCTION.prototype.getParent = function () {
        return this.parent;
    };
    SALVAGE_ABSTRACT_INSTRUCTION.prototype.getBlockType = function () {
        return this.type;
    };
    SALVAGE_ABSTRACT_INSTRUCTION.prototype.getParam = function (index) {
        return this.params
            ? this.params[index] || null
            : null;
    };
    SALVAGE_ABSTRACT_INSTRUCTION.prototype.setParam = function (index, value) {
        this.params[index] = value;
    };
    return SALVAGE_ABSTRACT_INSTRUCTION;
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
var SALVAGE_INSTRUCTION_IF = (function (_super) {
    __extends(SALVAGE_INSTRUCTION_IF, _super);
    function SALVAGE_INSTRUCTION_IF(params) {
        var _this = _super.call(this, E_SALVAGE_BLOCK_TYPE.TOKEN_IF, []) || this;
        _this.elseAppended = false;
        _this.trueBranchChildren = [];
        _this.falseBranchChildren = [];
        _this.params[0] = Salvage.normalizePath(params[0]);
        if (null === _this.params[0]) {
            throw new Error('Illegal IF variable: ' + params[0]);
        }
        return _this;
    }
    SALVAGE_INSTRUCTION_IF.prototype.append = function (instruction) {
        if (instruction.getBlockType() === E_SALVAGE_BLOCK_TYPE.TOKEN_ELSE) {
            if (this.elseAppended) {
                throw new Error('Else appended!');
            }
            this.elseAppended = true;
            return instruction;
        }
        if (this.elseAppended) {
            this.falseBranchChildren.push(instruction);
        }
        else {
            this.trueBranchChildren.push(instruction);
        }
        return instruction.withParent(this);
    };
    SALVAGE_INSTRUCTION_IF.prototype.allowChildren = function () {
        return true;
    };
    SALVAGE_INSTRUCTION_IF.prototype.parse = function (context) {
        var result = '';
        if (context.isNotEmpty(this.getParam(0))) {
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
    return SALVAGE_INSTRUCTION_IF;
}(SALVAGE_ABSTRACT_INSTRUCTION));
var SALVAGE_INSTRUCTION_END = (function (_super) {
    __extends(SALVAGE_INSTRUCTION_END, _super);
    function SALVAGE_INSTRUCTION_END() {
        return _super.call(this, E_SALVAGE_BLOCK_TYPE.TOKEN_END, null) || this;
    }
    SALVAGE_INSTRUCTION_END.prototype.allowChildren = function () {
        return false;
    };
    SALVAGE_INSTRUCTION_END.prototype.parse = function (context) {
        return '';
    };
    SALVAGE_INSTRUCTION_END.prototype.append = function (instruction) {
        throw new Error('Cannot append something into a END block!');
    };
    return SALVAGE_INSTRUCTION_END;
}(SALVAGE_ABSTRACT_INSTRUCTION));
var SALVAGE_UNLESS = (function (_super) {
    __extends(SALVAGE_UNLESS, _super);
    function SALVAGE_UNLESS(params) {
        var _this = _super.call(this, E_SALVAGE_BLOCK_TYPE.TOKEN_UNLESS, []) || this;
        _this.elseAppended = false;
        _this.trueBranchChildren = [];
        _this.falseBranchChildren = [];
        _this.params[0] = Salvage.normalizePath(params[0]);
        if (null === _this.params[0]) {
            throw new Error('Illegal UNLESS variable: ' + params[0]);
        }
        return _this;
    }
    SALVAGE_UNLESS.prototype.append = function (instruction) {
        if (instruction.getBlockType() === E_SALVAGE_BLOCK_TYPE.TOKEN_ELSE) {
            if (this.elseAppended) {
                throw new Error('Else appended!');
            }
            this.elseAppended = true;
        }
        if (this.elseAppended) {
            this.trueBranchChildren.push(instruction);
        }
        else {
            this.falseBranchChildren.push(instruction);
        }
        return instruction.withParent(this);
    };
    SALVAGE_UNLESS.prototype.allowChildren = function () {
        return true;
    };
    SALVAGE_UNLESS.prototype.parse = function (context) {
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
    return SALVAGE_UNLESS;
}(SALVAGE_ABSTRACT_INSTRUCTION));
var SALVAGE_TEXT = (function (_super) {
    __extends(SALVAGE_TEXT, _super);
    function SALVAGE_TEXT(text) {
        var _this = _super.call(this, E_SALVAGE_BLOCK_TYPE.TOKEN_TEXT, null) || this;
        _this.text = text;
        return _this;
    }
    SALVAGE_TEXT.prototype.allowChildren = function () {
        return false;
    };
    SALVAGE_TEXT.prototype.parse = function (context) {
        return this.text;
    };
    SALVAGE_TEXT.prototype.append = function (instruction) {
        throw new Error("Method not allowed.");
    };
    return SALVAGE_TEXT;
}(SALVAGE_ABSTRACT_INSTRUCTION));
var SALVAGE_BLOCK_VAR = (function (_super) {
    __extends(SALVAGE_BLOCK_VAR, _super);
    function SALVAGE_BLOCK_VAR(params, isEscaped) {
        var _this = _super.call(this, E_SALVAGE_BLOCK_TYPE.TOKEN_VAR, []) || this;
        _this.params.push(Salvage.normalizePath(params[0]));
        if (_this.params[0] === null) {
            throw new Error('Illegal variable: ' + params[0]);
        }
        for (var i = 1, len = params.length; i < len; i++) {
            _this.params.push(params[i]);
        }
        _this.isEscaped = isEscaped;
        return _this;
    }
    SALVAGE_BLOCK_VAR.prototype.allowChildren = function () {
        return false;
    };
    SALVAGE_BLOCK_VAR.prototype.parse = function (context) {
        var result = String(context.get(this.getParam(0)));
        for (var i = 1, len = this.params.length; i < len; i++) {
            result = context.getHelper(this.params[i]).func(result);
        }
        if (!this.isEscaped) {
            return result;
        }
        else {
            return result.replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;');
        }
    };
    SALVAGE_BLOCK_VAR.prototype.append = function (instruction) {
        throw new Error('A VAR block does not allow insertion');
    };
    return SALVAGE_BLOCK_VAR;
}(SALVAGE_ABSTRACT_INSTRUCTION));
var SALVAGE_INSTRUCTION_EACH = (function (_super) {
    __extends(SALVAGE_INSTRUCTION_EACH, _super);
    function SALVAGE_INSTRUCTION_EACH(params) {
        var _this = _super.call(this, E_SALVAGE_BLOCK_TYPE.TOKEN_EACH, []) || this;
        _this.children = [];
        _this.params.push(Salvage.normalizePath(params[0]));
        if (null === _this.params[0]) {
            throw new Error('Illegal each argument!');
        }
        return _this;
    }
    SALVAGE_INSTRUCTION_EACH.prototype.allowChildren = function () {
        return true;
    };
    SALVAGE_INSTRUCTION_EACH.prototype.parse = function (context) {
        var result = '';
        (function (self) {
            context.each(self.getParam(0), function (item) {
                for (var i = 0, len = self.children.length; i < len; i++) {
                    result = result.concat(self.children[i].parse(item));
                }
            });
        })(this);
        return result;
    };
    SALVAGE_INSTRUCTION_EACH.prototype.append = function (instruction) {
        this.children.push(instruction.withParent(this));
        return instruction;
    };
    return SALVAGE_INSTRUCTION_EACH;
}(SALVAGE_ABSTRACT_INSTRUCTION));
var SALVAGE_INSTRUCTION_ELSE = (function (_super) {
    __extends(SALVAGE_INSTRUCTION_ELSE, _super);
    function SALVAGE_INSTRUCTION_ELSE() {
        return _super.call(this, E_SALVAGE_BLOCK_TYPE.TOKEN_ELSE, null) || this;
    }
    SALVAGE_INSTRUCTION_ELSE.prototype.allowChildren = function () {
        return false;
    };
    SALVAGE_INSTRUCTION_ELSE.prototype.parse = function (context) {
        throw new Error("Should never be parsed");
    };
    SALVAGE_INSTRUCTION_ELSE.prototype.append = function (instruction) {
        throw new Error("Cannot have children");
    };
    SALVAGE_INSTRUCTION_ELSE.prototype.withParent = function (parent) {
        if (!parent || (parent.getBlockType() !== E_SALVAGE_BLOCK_TYPE.TOKEN_IF && parent.getBlockType() !== E_SALVAGE_BLOCK_TYPE.TOKEN_UNLESS)) {
            throw new Error('Invalid ELSE block parent: Expected IF or UNLESS!');
        }
        return this;
    };
    return SALVAGE_INSTRUCTION_ELSE;
}(SALVAGE_ABSTRACT_INSTRUCTION));
var SALVAGE_BLOCK_WITH = (function (_super) {
    __extends(SALVAGE_BLOCK_WITH, _super);
    function SALVAGE_BLOCK_WITH(params) {
        var _this = _super.call(this, E_SALVAGE_BLOCK_TYPE.TOKEN_WITH, []) || this;
        _this.children = [];
        _this.params.push(Salvage.normalizePath(params[0]));
        if (null === _this.params[0]) {
            throw new Error('Illegal WITH argument');
        }
        return _this;
    }
    SALVAGE_BLOCK_WITH.prototype.allowChildren = function () {
        return true;
    };
    SALVAGE_BLOCK_WITH.prototype.parse = function (context) {
        var ctx = context.cd(this.getParam(0)), result = '';
        for (var i = 0, len = this.children.length; i < len; i++) {
            result = result.concat(this.children[i].parse(ctx));
        }
        return result;
    };
    SALVAGE_BLOCK_WITH.prototype.append = function (instruction) {
        this.children.push(instruction.withParent(this));
        return instruction;
    };
    return SALVAGE_BLOCK_WITH;
}(SALVAGE_ABSTRACT_INSTRUCTION));
