import _ from 'lodash';
import { resolve } from 'path';
import { generateMetaInfoForFile } from '../src';

const ROOT = '__tests__/cases';

const assertSchema = (caseName: string) => {
  const file = resolve(`${ROOT}/${caseName}/index.ts`);
  const metaFile = resolve(`${ROOT}/${caseName}/meta-data.ts`);
  const result = generateMetaInfoForFile(file);
  const module = _.first(result.modules);
  const { meta } = require(metaFile);

  // console.log(JSON.stringify(module, null, 2));
  expect(module).toEqual(meta);

  expect(result.hasErrors).toBe(false);
};

const caseNames = [
  'array',
  'type-alias',
  'any-of',
  'basic-interface',
  'enum',
  'mixed-types',
  'basic-typeref',
  'typeref-arguments',
  'typeliteral',
  'typeliteral-argument'
  // 'meta-schema',
];

it.each(caseNames)('Process schema %s', caseName => {
  assertSchema(caseName);
});
