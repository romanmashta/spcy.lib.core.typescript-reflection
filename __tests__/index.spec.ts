import * as path from 'path';
import * as _ from 'lodash';
import * as fs from 'fs';
import { generateMetaInfoForFile, run } from '../src';

const CASES_ROOT = '__tests__/cases';
const MODULE_CONFIG = '__tests__/module/tsconfig.json';
const MODULE_PACKAGE = '__tests__/module/package.json';

const assertSchema = (caseName: string) => {
  const file = path.resolve(`${CASES_ROOT}/${caseName}/index.ts`);
  const metaFile = path.resolve(`${CASES_ROOT}/${caseName}/meta-data.ts`);
  const result = generateMetaInfoForFile(file);
  const module = _.first(result.modules);
  const { meta } = require(metaFile);

  //console.log(JSON.stringify(module, null, 2));
  expect(module).toEqual(meta);

  expect(result.hasErrors).toBe(false);
};

const caseNames = [
  'index-signature',
  'array',
  'type-alias',
  'one-of',
  'basic-interface',
  'enum',
  'mixed-types',
  'basic-typeref',
  'typeliteral',
  'typeliteral-argument',
  'meta-schema',
  'required-properties'
];

it.each(caseNames)('Process schema %s', caseName => {
  assertSchema(caseName);
});

it('process module', () => {
  const cwd = process.cwd();
  const files = run(path.join(cwd, MODULE_CONFIG), path.join(cwd, MODULE_PACKAGE));
  files.forEach(f => expect(fs.existsSync(f)).toBe(true));
});
