import * as path from 'path';
import * as _ from 'lodash';
import * as fs from 'fs';
import { generateMetaInfoForFile, exec } from '../src';

const CASES_ROOT = '__tests__/cases';
const MODULE_PATH = '__tests__/module';

const assertSchema = (caseName: string) => {
  const file = path.resolve(`${CASES_ROOT}/${caseName}/index.model.ts`);
  const metaFile = path.resolve(`${CASES_ROOT}/${caseName}/index.schema.ts`);
  const result = generateMetaInfoForFile(file);
  const module = _.first(result.modules);
  const { MetaSchema } = require(metaFile);

  // console.log(JSON.stringify(module, null, 2));
  expect(module).toEqual(MetaSchema);

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
  'required-properties',
  'inheritance'
];

it.each(caseNames)('Process schema %s', caseName => {
  assertSchema(caseName);
});

it('process module', () => {
  const cwd = process.cwd();
  const files = exec({ path: path.join(cwd, MODULE_PATH) });
  files.forEach(f => expect(fs.existsSync(f)).toBe(true));
});
