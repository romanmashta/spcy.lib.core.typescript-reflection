import _ from 'lodash';
import * as ts from 'typescript';
import path from 'path';
import fs from 'fs';
import minimatch from 'minimatch';
import handlebars from 'handlebars';
import { generateMetaInfoForFiles } from './meta-generator';
import { SourceFile, TypeInfo } from '@spcy/lib.core.reflection';
import { ModuleTemplate } from './templates';

const readConfigFromFile = (configFileName: string): ts.ParsedCommandLine => {
  const result = ts.parseConfigFileTextToJson(configFileName, ts.sys.readFile(configFileName)!);
  const configObject = result.config;

  const configParseResult = ts.parseJsonConfigFileContent(
    configObject,
    ts.sys,
    path.dirname(configFileName),
    {},
    path.basename(configFileName)
  );
  return configParseResult;
};

handlebars.registerHelper(
  'stringify',
  (object: TypeInfo) => new handlebars.SafeString(JSON.stringify(object, undefined, 4))
);

const renderModule = handlebars.compile(ModuleTemplate);

const writeSchemaFile = (sourceFile: SourceFile) => {
  const schemaFileName = sourceFile.fileName.replace(/model\.ts$/i, 'schema.ts');
  console.log(JSON.stringify(sourceFile, undefined, 4));
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
  console.info(`Using config from: ${resolvedConfigFileName}`);

  const config = readConfigFromFile(resolvedConfigFileName);
  const modelFiles = config.fileNames.filter(minimatch.filter('*.model.ts', { matchBase: true }));
  const result = generateMetaInfoForFiles(modelFiles, config.options);
  _.forEach(result.sourceFiles, writeSchemaFile);
};
