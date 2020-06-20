import _ from 'lodash';
import * as ts from 'typescript';
import path from 'path';
import fs from 'fs';
import minimatch from 'minimatch';
import handlebars from 'handlebars';
import { SourceFile, TypeInfo } from '@spcy/lib.core.reflection';
import stringify from 'stringify-object';
import { generateMetaInfoForFiles } from './meta-generator';
import { ModuleTemplate } from './templates';

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
  fs.writeFile(schemaFileName, moduleText, (err: Error | null) => {
    if (err) {
      throw new Error(`Unable to write schema file: ${err.message}`);
    }
  });
  return schemaFileName;
};

export const run = (configFileName?: string, packageFile?: string): string[] => {
  const resolvedConfigFileName = configFileName || path.join(process.cwd(), 'tsconfig.json');
  if (!fs.existsSync(resolvedConfigFileName)) throw new Error(`Cannot find tsconfig.json ${resolvedConfigFileName}`);

  const resolvedPackageFileName = packageFile || path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(resolvedPackageFileName)) throw new Error(`Cannot find package.json ${resolvedConfigFileName}`);

  const packageJson = JSON.parse(fs.readFileSync(resolvedPackageFileName, { encoding: 'utf-8' })) as PackageJson;
  const config = readConfigFromFile(resolvedConfigFileName);
  const modelFiles = config.fileNames.filter(minimatch.filter('*.model.ts', { matchBase: true }));
  const result = generateMetaInfoForFiles(modelFiles, config.options, { packageName: packageJson.name });
  return _.map(result.sourceFiles, writeSchemaFile);
};
