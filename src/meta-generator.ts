import _ from 'lodash';
import ts from 'typescript';
import cr from '@spcy/lib.core.reflection';
import path from 'path';
import handlebars from 'handlebars';
import stringify from 'stringify-object';
import fs from 'fs';
import minimatch from 'minimatch';
import { ModuleTemplate } from './templates';

const propTypeName = 'property';

type propertiesMap = { [name: string]: cr.TypeInfo };

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

  localRef = (ref: string): string => `#/$defs/${ref}`;
  typeId = (ref: string): string => `#/$defs/${ref}`;

  inspectIndexSignature = (node: ts.IndexSignatureDeclaration | undefined): cr.TypeInfo | undefined => {
    if (!node || !node.type) return undefined;
    return this.inspectType(node.type);
  };

  inspectLiteralType = (node: ts.LiteralTypeNode): cr.ConstLiteral => {
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

  inspectUnionType = (node: ts.UnionTypeNode): cr.OneOf => {
    return { oneOf: _.map(node.types, this.inspectType) };
  };

  inspectTypeLiteral = (node: ts.TypeLiteralNode): cr.TypeInfo => {
    return { ...this.processMembers(node.members) };
  };

  inspectArrayType = (node: ts.ArrayTypeNode): cr.ArrayType => {
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

  inspectExplicitProperty = (node: ts.TypeReferenceNode): cr.TypeInfo => {
    if (!node.typeArguments) throw new Error('No Type Arguments for Property');
    const [argType, argMeta] = node.typeArguments;
    const type = this.inspectType(argType);
    const meta = argMeta ? (this.typeLiteralToObject(argMeta) as propertyMetaObject) : {};
    return { ...type, ...meta };
  };

  inspectTypeRef = (node: ts.TypeReferenceNode): cr.TypeInfo => {
    const typeRef = (node.typeName as ts.Identifier).text;
    if (typeRef === propTypeName) return this.inspectExplicitProperty(node);
    const args = _.map(node.typeArguments, a => this.inspectType(a));
    return {
      $ref: this.localRef(typeRef),
      $arguments: _.isEmpty(args) ? undefined : args
    } as cr.TypeReference;
  };

  inspectExpressionWithTypeArguments = (node: ts.ExpressionWithTypeArguments): cr.TypeInfo => {
    const typeRef = (node.expression as ts.Identifier).text;
    return { $ref: this.localRef(typeRef) } as cr.TypeReference;
  };

  inspectType = (node: ts.TypeNode): cr.TypeInfo => {
    switch (node.kind) {
      case ts.SyntaxKind.StringKeyword:
        return { type: 'string' } as cr.StringType;
      case ts.SyntaxKind.NumberKeyword:
        return { type: 'number' } as cr.NumberType;
      case ts.SyntaxKind.BooleanKeyword:
        return { type: 'boolean' } as cr.BooleanType;
      case ts.SyntaxKind.NullKeyword:
        return { type: 'null' } as cr.NullType;
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
      case ts.SyntaxKind.ExpressionWithTypeArguments:
        return this.inspectExpressionWithTypeArguments(node as ts.ExpressionWithTypeArguments);
      default:
        return { type: 'string' } as cr.StringType;
    }
  };

  inspectProperty = (node: ts.PropertySignature): NamedInfo<cr.TypeInfo> => {
    const name = (node.name as ts.Identifier).text;
    if (!node.type) throw Error('Unknown PropertySignature Type');
    const info: cr.TypeInfo = this.inspectType(node.type);
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

  processMembers = (members: ts.NodeArray<ts.TypeElement>): cr.ObjectType => ({
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

  inspectInterface = (node: ts.InterfaceDeclaration): NamedInfo<cr.TypeInfo> => {
    const name = node.name.text;
    if (_.isEmpty(node.heritageClauses)) {
      const info: cr.ObjectType = {
        $id: this.typeId(name),
        ...this.processMembers(node.members)
      };
      return { [name]: info };
    }

    const childType: cr.ObjectType = {
      ...this.processMembers(node.members)
    };
    const parentTypes = _.chain(node.heritageClauses).first().get('types').map(this.inspectType).value();
    const info: cr.AllOf = {
      $id: this.typeId(name),
      allOf: [...parentTypes, childType]
    };
    return { [name]: info };
  };

  inspectEnumMember = (node: ts.EnumMember): cr.ConstLiteral => {
    const name = (node.name as ts.Identifier).text;
    return { const: name };
  };

  inspectEnum = (node: ts.EnumDeclaration): NamedInfo<cr.OneOf> => {
    const name = node.name.text;
    const info: cr.OneOf = {
      $id: this.typeId(name),
      oneOf: _.chain(node.members)
        .filter(ts.isEnumMember)
        .map(prop => this.inspectEnumMember(prop))
        .value()
    };
    return { [name]: info };
  };

  inspectTypeAlias = (node: ts.TypeAliasDeclaration): NamedInfo<cr.TypeInfo> => {
    const name = node.name.text;
    const type = {
      $id: this.typeId(name),
      ...this.inspectType(node.type)
    };
    return { [name]: type };
  };

  transform = (): cr.MetaInfo => {
    const metaInfo: cr.MetaInfo = {
      sourceFiles: [],
      modules: [],
      hasErrors: false
    };

    _.forEach(this.sources, sourceFile => {
      const module: cr.Module = { $defs: {} };
      const moduleFile: cr.SourceFile = { module, fileName: sourceFile.fileName };
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
): cr.MetaInfo => new MetaGenerator(files, options, generatorOptions).transform();

export const generateMetaInfoForFile = (
  file: string,
  options: ts.CompilerOptions = {},
  generatorOptions: GeneratorOptions = {}
): cr.MetaInfo => generateMetaInfoForFiles([file], options, generatorOptions);

interface PackageJson {
  name: string;
}

interface Options {
  path?: string;
  includes?: string[];
  skipModelRegistration?: boolean;
}

export const getDefaultOptions = (): Options => ({ includes: [], skipModelRegistration: false });

const readConfigFromFile = (configFileName: string, options: Options): ts.ParsedCommandLine => {
  const config = ts.sys.readFile(configFileName);
  if (!config) throw new Error(`Cannot read config file: ${configFileName}`);
  const result = ts.parseConfigFileTextToJson(configFileName, config);
  const configObject = result.config;
  configObject.include = [...configObject.include, ...(options.includes || [])];

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
  (object: cr.TypeInfo) =>
    new handlebars.SafeString(
      stringify(object, {
        indent: '    ',
        filter: (v, p) => !_.isUndefined(v[p])
      })
    )
);

const renderModule = handlebars.compile(ModuleTemplate);

const writeSchemaFile = (sourceFile: cr.SourceFile, options: Options): string => {
  const schemaFileName = sourceFile.fileName.replace(/model\.ts$/i, 'schema.ts');
  handlebars.registerHelper('useRegistration', () => !options.skipModelRegistration);
  const moduleText = renderModule(sourceFile);
  fs.writeFileSync(schemaFileName, moduleText);
  return schemaFileName;
};

export const exec = (options: Options): string[] => {
  const resolvedPackageFileName = path.join(options.path ? path.resolve(options.path) : process.cwd(), 'package.json');
  if (!fs.existsSync(resolvedPackageFileName)) throw new Error(`Cannot find package.json ${resolvedPackageFileName}`);
  const cwd = path.dirname(resolvedPackageFileName);

  const resolvedConfigFileName = path.join(cwd, 'tsconfig.json');
  if (!fs.existsSync(resolvedConfigFileName)) throw new Error(`Cannot find tsconfig.json ${resolvedConfigFileName}`);

  const packageJson = JSON.parse(fs.readFileSync(resolvedPackageFileName, { encoding: 'utf-8' })) as PackageJson;
  const config = readConfigFromFile(resolvedConfigFileName, options);
  const modelFiles = config.fileNames.filter(minimatch.filter('*.model.ts', { matchBase: true }));
  const result = generateMetaInfoForFiles(modelFiles, config.options, { packageName: packageJson.name });
  return _.map(result.sourceFiles, sf => writeSchemaFile(sf, options));
};
