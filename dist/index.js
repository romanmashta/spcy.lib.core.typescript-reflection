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
var inspectInterface = function (node, module) {
    var interface = {};
    module[node.name.text] = interface;
};
export var transform = function (files, program) {
    var sources = _.map(files, function (f) { return program.getSourceFile(f); });
    var metaInfo = {
        modules: [],
        hasErrors: false
    };
    // const checker = program.getTypeChecker();
    _.forEach(sources, function (sourceFile) {
        var module = {};
        metaInfo.modules = __spreadArrays(metaInfo.modules, [module]);
        var inspect = function (node) {
            if (ts.isInterfaceDeclaration(node)) {
                inspectInterface(node, module);
            }
            else if (ts.isInterfaceDeclaration(node)) {
            }
            else
                ts.forEachChild(node, inspect);
        };
        inspect(sourceFile);
    });
    return metaInfo;
};
var createProgram = function (files, options) {
    return ts.createProgram(files, __assign(__assign({}, defaultOptions), options));
};
export var generateMetaInfoForFiles = function (files, options) {
    return transform(files, createProgram(files, options));
};
export var generateMetaInfoForFile = function (file, options) {
    if (options === void 0) { options = {}; }
    return generateMetaInfoForFiles([file], options);
};
//# sourceMappingURL=index.js.map