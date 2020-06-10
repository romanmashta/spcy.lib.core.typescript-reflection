import _ from 'lodash';
import ts from 'typescript';
import { EnumDeclaration, InterfaceDeclaration, MetaInfo, Module, TypeInfo } from './meta-data';

const defaultOptions: ts.CompilerOptions = {
  declaration: false
};

interface NamedInfo<T> {
  [name: string]: T;
}

export const transform = (files: string[], program: ts.Program): MetaInfo => {
  const sources = _.map(files, f => program.getSourceFile(f)!);
  const typeChecker = program.getTypeChecker();

  const inspectType = (node: ts.TypeNode): TypeInfo => {
    switch (node.kind) {
      case ts.SyntaxKind.StringKeyword:
        return 'string';
      case ts.SyntaxKind.NumberKeyword:
        return 'number';
      case ts.SyntaxKind.BooleanKeyword:
        return 'boolean';
      default:
        return 'string';
    }
  };

  const inspectProperty = (node: ts.PropertySignature): NamedInfo<TypeInfo> => {
    const name = (node.name as ts.Identifier).text;
    const info: TypeInfo = inspectType(node.type!);
    return { [name]: info };
  };

  const inspectInterface = (node: ts.InterfaceDeclaration): NamedInfo<InterfaceDeclaration> => {
    const name = node.name.text;
    const info: InterfaceDeclaration = {
      interface: {
        properties: _.chain(node.members)
          .filter(ts.isPropertySignature)
          .reduce((r: any, prop: ts.PropertySignature) => ({ ...r, ...inspectProperty(prop) }), {})
          .value()
      }
    };
    return { [name]: info };
  };

  const inspectEnumMember = (node: ts.EnumMember): NamedInfo<string> => {
    const name = (node.name as ts.Identifier).text;
    return { [name]: name };
  };

  const inspectEnum = (node: ts.EnumDeclaration): NamedInfo<EnumDeclaration> => {
    const name = node.name.text;
    const info: EnumDeclaration = {
      enum: _.chain(node.members)
        .filter(ts.isEnumMember)
        .reduce((r: any, prop: ts.EnumMember) => ({ ...r, ...inspectEnumMember(prop) }), {})
        .value()
    };
    return { [name]: info };
  };

  const metaInfo: MetaInfo = {
    modules: [],
    hasErrors: false
  };

  _.forEach(sources, sourceFile => {
    const module: Module = { members: {} };
    metaInfo.modules = [...metaInfo.modules, module];

    const inspect = (node: ts.Node) => {
      if (ts.isInterfaceDeclaration(node)) {
        module.members = { ...module.members, ...inspectInterface(node) };
      } else if (ts.isEnumDeclaration(node)) {
        module.members = { ...module.members, ...inspectEnum(node) };
      } else ts.forEachChild(node, inspect);
    };

    inspect(sourceFile);
  });

  return metaInfo;
};

const createProgram = (files: string[], options: ts.CompilerOptions): ts.Program =>
  ts.createProgram(files, { ...defaultOptions, ...options });

export const generateMetaInfoForFiles = (files: string[], options: ts.CompilerOptions): MetaInfo =>
  transform(files, createProgram(files, options));

export const generateMetaInfoForFile = (file: string, options: ts.CompilerOptions = {}): MetaInfo =>
  generateMetaInfoForFiles([file], options);
