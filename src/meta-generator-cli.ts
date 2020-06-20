import * as ts from 'typescript';
import path from 'path';
import fs from 'fs';
import minimatch from 'minimatch';
import { generateMetaInfoForFiles } from './meta-generator';

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

export const run = (configFileName?: string) => {
  const resolvedConfigFileName = configFileName || path.join(process.cwd(), 'tsconfig.json');
  if (!fs.existsSync(resolvedConfigFileName)) {
    throw new Error(`Cannot find tsconfig.json ${resolvedConfigFileName}`);
  }
  console.info(`Using config from: ${resolvedConfigFileName}`);

  const config = readConfigFromFile(resolvedConfigFileName);
  const modelFiles = config.fileNames.filter(minimatch.filter('*.model.ts', { matchBase: true }));
  const result = generateMetaInfoForFiles(modelFiles, config.options);
  console.log(result);
};
