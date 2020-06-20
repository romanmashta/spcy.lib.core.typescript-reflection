import _ from 'lodash';
import ts from 'typescript';
import {
  MetaInfo,
  Module,
  ObjectType,
  TypeInfo,
  ArrayType,
  OneOf,
  ConstLiteral,
  NumberType,
  StringType,
  BooleanType,
  NullType,
  SourceFile
} from '@spcy/lib.core.reflection';
import path from 'path';
import handlebars from 'handlebars';
import stringify from 'stringify-object';
import fs from 'fs';
import minimatch from 'minimatch';
import { ModuleTemplate } from './templates';

const propTypeName = 'property';

type propertiesMap = { [name: string]: TypeInfo };

type propertyMetaObject = { [name: string]: propertyMeta };
type propertyMeta = propertyMetaObject | string | number | boolean | null;

const defaultOptions: ts.CompilerOptions = {
  declaration: false
};

interface NamedInfo<T> {
  [name: string]: T;
}

export interface GeneratorOptions {
  packageName?: string;
  noAdditionalProperties?: boolean;
}

class MetaGenerator {
  private readonly files: string[];
  private readonly sources: ts.SourceFile[];
  private options: ts.CompilerOptions;
  private program: ts.Program;
  private typeChecker: ts.TypeChecker;
  private generatorOptions: GeneratorOptions;

  constructor(files: string[], options: ts.CompilerOptions = {}, generatorOptions: GeneratorOptions = {}) {
    this.files = files;
    this.options = options;
    this.generatorOptions = generatorOptions;
    this.program = ts.createProgram(files, { ...defaultOptions, ...options });
    this.sources = _.map(this.files, f => this.program.getSourceFile(f)) as ts.SourceFile[];
    this.typeChecker = this.program.getTypeChecker();
  }

  localRef = (ref: string): string => `${this.generatorOptions.packageName || '#/$defs'}/${ref}`;
  typeId = (ref: string): string | undefined =>
    this.generatorOptions.packageName ? `${this.generatorOptions.packageName}/${ref}` : undefined;

  inspectIndexSignature = (node: ts.IndexSignatureDeclaration | undefined): TypeInfo | undefined => {
    if (!node || !node.type) return undefined;
    return this.inspectType(node.type);
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

  typeLiteralToObject = (node: ts.TypeNode): propertyMeta => {
    if (ts.isTypeLiteralNode(node)) {
      return _.chain(node.members)
        .filter(ts.isPropertySignature)
        .reduce(
          (r, m) => ({ ...r, [(m.name as ts.Identifier).text]: this.typeLiteralToObject(m.type as ts.TypeNode) }),
          {}
        )
        .value();
    }
    if (ts.isLiteralTypeNode(node)) {
      const { literal } = node;
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
    }
    return null;
  };

  inspectExplicitProperty = (node: ts.TypeReferenceNode): TypeInfo => {
    if (!node.typeArguments) throw new Error('No Type Arguments for Property');
    const [argType, argMeta] = node.typeArguments;
    const type = this.inspectType(argType);
    const meta = argMeta ? (this.typeLiteralToObject(argMeta) as propertyMetaObject) : {};
    return { ...type, ...meta };
  };

  inspectTypeRef = (node: ts.TypeReferenceNode): TypeInfo => {
    const typeRef = (node.typeName as ts.Identifier).text;
    if (typeRef === propTypeName) return this.inspectExplicitProperty(node);
    return { $ref: this.localRef(typeRef) };
  };

  inspectType = (node: ts.TypeNode): TypeInfo => {
    switch (node.kind) {
      case ts.SyntaxKind.StringKeyword:
        return { type: 'string' } as StringType;
      case ts.SyntaxKind.NumberKeyword:
        return { type: 'number' } as NumberType;
      case ts.SyntaxKind.BooleanKeyword:
        return { type: 'boolean' } as BooleanType;
      case ts.SyntaxKind.NullKeyword:
        return { type: 'null' } as NullType;
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
      default:
        return { type: 'string' } as StringType;
    }
  };

  inspectProperty = (node: ts.PropertySignature): NamedInfo<TypeInfo> => {
    const name = (node.name as ts.Identifier).text;
    if (!node.type) throw Error('Unknown PropertySignature Type');
    const info: TypeInfo = this.inspectType(node.type);
    return { [name]: info };
  };

  getRequired = (members: ts.NodeArray<ts.TypeElement>): string[] | undefined => {
    const result = _.chain(members)
      .filter(ts.isPropertySignature)
      .filter(p => !p.questionToken)
      .map(p => (p.name as ts.Identifier).text)
      .value();
    return _.isEmpty(result) ? undefined : result;
  };

  processMembers = (members: ts.NodeArray<ts.TypeElement>): ObjectType => ({
    type: 'object',
    required: this.getRequired(members),
    properties: _.chain(members)
      .filter(ts.isPropertySignature)
      .reduce(
        (r: propertiesMap | undefined, prop: ts.PropertySignature) => ({
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
      $id: this.typeId(name),
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
      $id: this.typeId(name),
      oneOf: _.chain(node.members)
        .filter(ts.isEnumMember)
        .map(prop => this.inspectEnumMember(prop))
        .value()
    };
    return { [name]: info };
  };

  inspectTypeAlias = (node: ts.TypeAliasDeclaration): NamedInfo<TypeInfo> => {
    const name = node.name.text;
    const type = {
      $id: this.typeId(name),
      ...this.inspectType(node.type)
    };
    return { [name]: type };
  };

  transform = (): MetaInfo => {
    const metaInfo: MetaInfo = {
      sourceFiles: [],
      modules: [],
      hasErrors: false
    };

    _.forEach(this.sources, sourceFile => {
      const module: Module = { $defs: {} };
      const moduleFile: SourceFile = { module, fileName: sourceFile.fileName };
      metaInfo.sourceFiles = [...metaInfo.sourceFiles, moduleFile];
      metaInfo.modules = [...metaInfo.modules, module];

      const inspect = (node: ts.Node) => {
        if (ts.isInterfaceDeclaration(node)) {
          module.$defs = {
            ...module.$defs,
            ...this.inspectInterface(node)
          };
        } else if (ts.isEnumDeclaration(node)) {
          module.$defs = {
            ...module.$defs,
            ...this.inspectEnum(node)
          };
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

interface PackageJson {
  name: string;
}

const readConfigFromFile = (configFileName: string): ts.ParsedCommandLine => {
  const config = ts.sys.readFile(configFileName);
  if (!config) throw new Error(`Cannot read config file: ${configFileName}`);
  const result = ts.parseConfigFileTextToJson(configFileName, config);
  const configObject = result.config;

  return ts.parseJsonConfigFileContent(
    configObject,
    ts.sys,
    path.dirname(configFileName),
    {},
    path.basename(configFileName)
  );
};

handlebars.registerHelper(
  'stringify',
  (object: TypeInfo) =>
    new handlebars.SafeString(
      stringify(object, {
        indent: '    ',
        filter: (v, p) => !_.isUndefined(v[p])
      })
    )
);

const renderModule = handlebars.compile(ModuleTemplate);

const writeSchemaFile = (sourceFile: SourceFile): string => {
  const schemaFileName = sourceFile.fileName.replace(/model\.ts$/i, 'schema.ts');
  const moduleText = renderModule(sourceFile);
  fs.writeFileSync(schemaFileName, moduleText);
  return schemaFileName;
};

export const exec = (packageFile?: string): string[] => {
  const resolvedPackageFileName = packageFile || path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(resolvedPackageFileName)) throw new Error(`Cannot find package.json ${resolvedPackageFileName}`);
  const cwd = path.dirname(resolvedPackageFileName);

  const resolvedConfigFileName = path.join(cwd, 'tsconfig.json');
  if (!fs.existsSync(resolvedConfigFileName)) throw new Error(`Cannot find tsconfig.json ${resolvedConfigFileName}`);

  const packageJson = JSON.parse(fs.readFileSync(resolvedPackageFileName, { encoding: 'utf-8' })) as PackageJson;
  const config = readConfigFromFile(resolvedConfigFileName);
  const modelFiles = config.fileNames.filter(minimatch.filter('*.model.ts', { matchBase: true }));
  const result = generateMetaInfoForFiles(modelFiles, config.options, { packageName: packageJson.name });
  return _.map(result.sourceFiles, writeSchemaFile);
};
