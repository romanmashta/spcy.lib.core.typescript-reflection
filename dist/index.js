var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import _ from 'lodash';
import ts from 'typescript';
var defaultOptions = {
    declaration: false
};
var MetaGenerator = /** @class */ (function () {
    function MetaGenerator(files, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.inspectProperty = function (node) {
            var _a;
            var name = node.name.text;
            var info = _this.inspectType(node.type);
            return _a = {}, _a[name] = info, _a;
        };
        this.processMembers = function (members) { return ({
            properties: _.chain(members)
                .filter(ts.isPropertySignature)
                .reduce(function (r, prop) { return (__assign(__assign({}, r), _this.inspectProperty(prop))); }, {})
                .value()
        }); };
        this.inspectTypeLiteral = function (node) {
            return __assign({}, _this.processMembers(node.members));
        };
        this.inspectLiteralType = function (node) {
            var literal = node.literal;
            switch (literal.kind) {
                case ts.SyntaxKind.StringLiteral:
                    return literal.text;
                case ts.SyntaxKind.NumericLiteral:
                    return _.toNumber(literal.text);
                case ts.SyntaxKind.TrueKeyword:
                    return true;
                case ts.SyntaxKind.FalseKeyword:
                    return false;
                default:
                    return null;
            }
        };
        this.inspectTypeRef = function (node) {
            var typeRef = node.typeName.text;
            var args = node.typeArguments ? _.map(node.typeArguments, _this.inspectType) : undefined;
            return { typeRef: typeRef, arguments: args };
        };
        this.inspectType = function (node) {
            switch (node.kind) {
                case ts.SyntaxKind.StringKeyword:
                    return 'string';
                case ts.SyntaxKind.NumberKeyword:
                    return 'number';
                case ts.SyntaxKind.BooleanKeyword:
                    return 'boolean';
                case ts.SyntaxKind.TypeReference:
                    return _this.inspectTypeRef(node);
                case ts.SyntaxKind.TypeLiteral:
                    return _this.inspectTypeLiteral(node);
                case ts.SyntaxKind.LiteralType:
                    return _this.inspectLiteralType(node);
                case ts.SyntaxKind.NullKeyword:
                    return null;
                default:
                    return 'string';
            }
        };
        this.inspectInterface = function (node) {
            var _a;
            var name = node.name.text;
            var info = __assign({}, _this.processMembers(node.members));
            return _a = {}, _a[name] = info, _a;
        };
        this.inspectEnumMember = function (node) {
            var _a;
            var name = node.name.text;
            return _a = {}, _a[name] = name, _a;
        };
        this.inspectEnum = function (node) {
            var _a;
            var name = node.name.text;
            var info = {
                enum: _.chain(node.members)
                    .filter(ts.isEnumMember)
                    .reduce(function (r, prop) { return (__assign(__assign({}, r), _this.inspectEnumMember(prop))); }, {})
                    .value()
            };
            return _a = {}, _a[name] = info, _a;
        };
        this.transform = function () {
            var metaInfo = {
                modules: [],
                hasErrors: false
            };
            _.forEach(_this.sources, function (sourceFile) {
                var module = { members: {} };
                metaInfo.modules = __spreadArrays(metaInfo.modules, [module]);
                var inspect = function (node) {
                    if (ts.isInterfaceDeclaration(node)) {
                        module.members = __assign(__assign({}, module.members), _this.inspectInterface(node));
                    }
                    else if (ts.isEnumDeclaration(node)) {
                        module.members = __assign(__assign({}, module.members), _this.inspectEnum(node));
                    }
                    else
                        ts.forEachChild(node, inspect);
                };
                inspect(sourceFile);
            });
            return metaInfo;
        };
        this.files = files;
        this.options = options;
        this.program = ts.createProgram(files, __assign(__assign({}, defaultOptions), options));
        this.sources = _.map(this.files, function (f) { return _this.program.getSourceFile(f); });
        this.typeChecker = this.program.getTypeChecker();
    }
    return MetaGenerator;
}());
export var generateMetaInfoForFiles = function (files, options) {
    return new MetaGenerator(files, options).transform();
};
export var generateMetaInfoForFile = function (file, options) {
    if (options === void 0) { options = {}; }
    return new MetaGenerator([file], options).transform();
};
//# sourceMappingURL=index.js.map