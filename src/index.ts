import _ from 'lodash';
import ts, { NodeArray, SourceFile, TypeElement } from 'typescript';
import {
  MetaInfo,
  Module,
  ObjectType,
  TypeInfo,
  SimpleType,
  TypeReference,
  ArrayType,
  OneOf,
  ConstLiteral
} from '@spcy/lib.core.reflection';

const localRef = (ref: string): string => `#/$defs/${ref}`;

const defaultOptions: ts.CompilerOptions = {
  declaration: false
};

interface NamedInfo<T> {
  [name: string]: T;
}

export interface GeneratorOptions {
  noAdditionalProperties?: boolean;
}

class MetaGenerator {
  private files: string[];
  private options: ts.CompilerOptions;
  private program: ts.Program;
  private sources: SourceFile[];
  private typeChecker: ts.TypeChecker;
  private generatorOptions: GeneratorOptions;

  constructor(files: string[], options: ts.CompilerOptions = {}, generatorOptions: GeneratorOptions = {}) {
    this.files = files;
    this.options = options;
    this.generatorOptions = generatorOptions;
    this.program = ts.createProgram(files, { ...defaultOptions, ...options });
    this.sources = _.map(this.files, f => this.program.getSourceFile(f)!);
    this.typeChecker = this.program.getTypeChecker();
  }

  inspectIndexSignature = (node: ts.IndexSignatureDeclaration | undefined): TypeInfo | undefined => {
    if (!node) return undefined;
    return this.inspectType(node.type!);
  };

  inspectLiteralType = (node: ts.LiteralTypeNode): ConstLiteral => {
    const { literal } = node;
    switch (literal.kind) {
      case ts.SyntaxKind.StringLiteral:
        return { const: literal.text };
      case ts.SyntaxKind.NumericLiteral:
        return { const: _.toNumber(literal.text) };
      case ts.SyntaxKind.TrueKeyword:
        return { const: true };
      case ts.SyntaxKind.FalseKeyword:
        return { const: false };
      default:
        return { const: null };
    }
  };

  inspectUnionType = (node: ts.UnionTypeNode): OneOf => {
    return { oneOf: _.map(node.types, this.inspectType) };
  };

  inspectTypeLiteral = (node: ts.TypeLiteralNode): TypeInfo => {
    return { ...this.processMembers(node.members) };
  };

  inspectArrayType = (node: ts.ArrayTypeNode): ArrayType => {
    return {
      type: 'array',
      items: this.inspectType(node.elementType)
    };
  };

  inspectTypeRef = (node: ts.TypeReferenceNode): TypeReference => {
    const typeRef = (node.typeName as ts.Identifier).text;
    // const args = node.typeArguments ? _.map(node.typeArguments, this.inspectType) : undefined;
    return { $ref: localRef(typeRef) };
  };

  inspectType = (node: ts.TypeNode): TypeInfo => {
    switch (node.kind) {
      case ts.SyntaxKind.StringKeyword:
        return { type: 'string' } as SimpleType;
      case ts.SyntaxKind.NumberKeyword:
        return { type: 'number' } as SimpleType;
      case ts.SyntaxKind.BooleanKeyword:
        return { type: 'boolean' } as SimpleType;
      case ts.SyntaxKind.TypeReference:
        return this.inspectTypeRef(node as ts.TypeReferenceNode);
      case ts.SyntaxKind.ArrayType:
        return this.inspectArrayType(node as ts.ArrayTypeNode);
      case ts.SyntaxKind.TypeLiteral:
        return this.inspectTypeLiteral(node as ts.TypeLiteralNode);
      case ts.SyntaxKind.UnionType:
        return this.inspectUnionType(node as ts.UnionTypeNode);
      case ts.SyntaxKind.LiteralType:
        return this.inspectLiteralType(node as ts.LiteralTypeNode);
      case ts.SyntaxKind.NullKeyword:
        return { type: 'null' };
      default:
        return { type: 'string' } as SimpleType;
    }
  };

  inspectProperty = (node: ts.PropertySignature): NamedInfo<TypeInfo> => {
    const name = (node.name as ts.Identifier).text;
    const info: TypeInfo = this.inspectType(node.type!);
    return { [name]: info };
  };

  getRequired = (members: NodeArray<TypeElement>): string[] | undefined => {
    const result = _.chain(members)
      .filter(ts.isPropertySignature)
      .filter(p => !p.questionToken)
      .map(p => (p.name as ts.Identifier).text)
      .value();
    return _.isEmpty(result) ? undefined : result;
  };

  processMembers = (members: NodeArray<TypeElement>): ObjectType => ({
    type: 'object',
    required: this.getRequired(members),
    properties: _.chain(members)
      .filter(ts.isPropertySignature)
      .reduce(
        (r: any, prop: ts.PropertySignature) => ({
          ...(r || {}),
          ...this.inspectProperty(prop)
        }),
        undefined
      )
      .value(),
    additionalProperties:
      this.inspectIndexSignature(_.find(members, ts.isIndexSignatureDeclaration)) ||
      (this.generatorOptions.noAdditionalProperties ? false : undefined)
  });

  inspectInterface = (node: ts.InterfaceDeclaration): NamedInfo<ObjectType> => {
    const name = node.name.text;
    const info: ObjectType = {
      ...this.processMembers(node.members)
    };
    return { [name]: info };
  };

  inspectEnumMember = (node: ts.EnumMember): ConstLiteral => {
    const name = (node.name as ts.Identifier).text;
    return { const: name };
  };

  inspectEnum = (node: ts.EnumDeclaration): NamedInfo<OneOf> => {
    const name = node.name.text;
    const info: OneOf = {
      oneOf: _.chain(node.members)
        .filter(ts.isEnumMember)
        .map(prop => this.inspectEnumMember(prop))
        .value()
    };
    return { [name]: info };
  };

  inspectTypeAlias = (node: ts.TypeAliasDeclaration): NamedInfo<TypeInfo> => {
    const name = node.name.text;
    const type = this.inspectType(node.type);
    return { [name]: type };
  };

  transform = (): MetaInfo => {
    const metaInfo: MetaInfo = {
      modules: [],
      hasErrors: false
    };

    _.forEach(this.sources, sourceFile => {
      const module: Module = { $defs: {} };
      metaInfo.modules = [...metaInfo.modules, module];

      const inspect = (node: ts.Node) => {
        if (ts.isInterfaceDeclaration(node)) {
          module.$defs = {
            ...module.$defs,
            ...this.inspectInterface(node)
          };
        } else if (ts.isEnumDeclaration(node)) {
          module.$defs = { ...module.$defs, ...this.inspectEnum(node) };
        } else if (ts.isTypeAliasDeclaration(node)) {
          module.$defs = {
            ...module.$defs,
            ...this.inspectTypeAlias(node)
          };
        } else ts.forEachChild(node, inspect);
      };

      inspect(sourceFile);
    });

    return metaInfo;
  };
}

export const generateMetaInfoForFiles = (
  files: string[],
  options: ts.CompilerOptions,
  generatorOptions: GeneratorOptions = {}
): MetaInfo => new MetaGenerator(files, options, generatorOptions).transform();

export const generateMetaInfoForFile = (
  file: string,
  options: ts.CompilerOptions = {},
  generatorOptions: GeneratorOptions = {}
): MetaInfo => generateMetaInfoForFiles([file], options, generatorOptions);
