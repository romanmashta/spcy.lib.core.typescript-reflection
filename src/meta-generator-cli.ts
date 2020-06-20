import _ from 'lodash';
import * as ts from 'typescript';
import path from 'path';
import fs from 'fs';
import minimatch from 'minimatch';
import handlebars from 'handlebars';
import { SourceFile, TypeInfo } from '@spcy/lib.core.reflection';
import { generateMetaInfoForFiles } from './meta-generator';
import { ModuleTemplate } from './templates';

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
  (object: TypeInfo) => new handlebars.SafeString(JSON.stringify(object, undefined, 4))
);

const renderModule = handlebars.compile(ModuleTemplate);

const writeSchemaFile = (sourceFile: SourceFile) => {
  const schemaFileName = sourceFile.fileName.replace(/model\.ts$/i, 'schema.ts');
  const moduleText = renderModule(sourceFile);
  fs.writeFile(schemaFileName, moduleText, (err: Error | null) => {
    if (err) {
      throw new Error(`Unable to write schema file: ${err.message}`);
    }
  });
};

export const run = (configFileName?: string) => {
  const resolvedConfigFileName = configFileName || path.join(process.cwd(), 'tsconfig.json');
  if (!fs.existsSync(resolvedConfigFileName)) {
    throw new Error(`Cannot find tsconfig.json ${resolvedConfigFileName}`);
  }
  const config = readConfigFromFile(resolvedConfigFileName);
  const modelFiles = config.fileNames.filter(minimatch.filter('*.model.ts', { matchBase: true }));
  const result = generateMetaInfoForFiles(modelFiles, config.options);
  _.forEach(result.sourceFiles, writeSchemaFile);
};
