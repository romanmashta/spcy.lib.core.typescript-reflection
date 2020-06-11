import _ from 'lodash';
import ts, { NodeArray, SourceFile, TypeElement } from 'typescript';
import {
  EnumDeclaration,
  InterfaceDeclaration,
  MetaInfo,
  Module,
  TypeInfo,
  TypeLiteral,
  TypeReference
} from './meta-data';

const defaultOptions: ts.CompilerOptions = {
  declaration: false
};

interface NamedInfo<T> {
  [name: string]: T;
}

class MetaGenerator {
  private files: string[];
  private options: ts.CompilerOptions;
  private program: ts.Program;
  private sources: SourceFile[];
  private typeChecker: ts.TypeChecker;

  constructor(files: string[], options: ts.CompilerOptions = {}) {
    this.files = files;
    this.options = options;
    this.program = ts.createProgram(files, { ...defaultOptions, ...options });
    this.sources = _.map(this.files, f => this.program.getSourceFile(f)!);
    this.typeChecker = this.program.getTypeChecker();
  }

  inspectProperty = (node: ts.PropertySignature): NamedInfo<TypeInfo> => {
    const name = (node.name as ts.Identifier).text;
    const info: TypeInfo = this.inspectType(node.type!);
    return { [name]: info };
  };

  processMembers = (members: NodeArray<TypeElement>): TypeLiteral => ({
    properties: _.chain(members)
      .filter(ts.isPropertySignature)
      .reduce((r: any, prop: ts.PropertySignature) => ({ ...r, ...this.inspectProperty(prop) }), {})
      .value()
  });

  inspectTypeLiteral = (node: ts.TypeLiteralNode): TypeLiteral => {
    return { ...this.processMembers(node.members) };
  };

  inspectTypeRef = (node: ts.TypeReferenceNode): TypeReference => {
    const typeRef = (node.typeName as ts.Identifier).text;
    const args = node.typeArguments ? _.map(node.typeArguments, this.inspectType) : undefined;
    return { typeRef, arguments: args };
  };

  inspectType = (node: ts.TypeNode): TypeInfo => {
    switch (node.kind) {
      case ts.SyntaxKind.StringKeyword:
        return 'string';
      case ts.SyntaxKind.NumberKeyword:
        return 'number';
      case ts.SyntaxKind.BooleanKeyword:
        return 'boolean';
      case ts.SyntaxKind.TypeReference:
        return this.inspectTypeRef(node as ts.TypeReferenceNode);
      case ts.SyntaxKind.TypeLiteral:
        return this.inspectTypeLiteral(node as ts.TypeLiteralNode);
      default:
        return 'string';
    }
  };

  inspectInterface = (node: ts.InterfaceDeclaration): NamedInfo<InterfaceDeclaration> => {
    const name = node.name.text;
    const info: InterfaceDeclaration = {
      interface: {
        ...this.processMembers(node.members)
      }
    };
    return { [name]: info };
  };

  inspectEnumMember = (node: ts.EnumMember): NamedInfo<string> => {
    const name = (node.name as ts.Identifier).text;
    return { [name]: name };
  };

  inspectEnum = (node: ts.EnumDeclaration): NamedInfo<EnumDeclaration> => {
    const name = node.name.text;
    const info: EnumDeclaration = {
      enum: _.chain(node.members)
        .filter(ts.isEnumMember)
        .reduce((r: any, prop: ts.EnumMember) => ({ ...r, ...this.inspectEnumMember(prop) }), {})
        .value()
    };
    return { [name]: info };
  };

  transform = (): MetaInfo => {
    const metaInfo: MetaInfo = {
      modules: [],
      hasErrors: false
    };

    _.forEach(this.sources, sourceFile => {
      const module: Module = { members: {} };
      metaInfo.modules = [...metaInfo.modules, module];

      const inspect = (node: ts.Node) => {
        if (ts.isInterfaceDeclaration(node)) {
          module.members = { ...module.members, ...this.inspectInterface(node) };
        } else if (ts.isEnumDeclaration(node)) {
          module.members = { ...module.members, ...this.inspectEnum(node) };
        } else ts.forEachChild(node, inspect);
      };

      inspect(sourceFile);
    });

    return metaInfo;
  };
}

export const generateMetaInfoForFiles = (files: string[], options: ts.CompilerOptions): MetaInfo =>
  new MetaGenerator(files, options).transform();

export const generateMetaInfoForFile = (file: string, options: ts.CompilerOptions = {}): MetaInfo =>
  new MetaGenerator([file], options).transform();
