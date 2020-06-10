import _ from 'lodash';
import { resolve } from 'path';
import { generateMetaInfoForFile } from '../src';

const ROOT = '__tests__/cases';

const assertSchema = (caseName: string) =>
  test(`It process ${caseName}`, () => {
    const file = resolve(`${ROOT}/${caseName}/index.ts`);
    const metaFile = resolve(`${ROOT}/${caseName}/meta-data.ts`);
    const result = generateMetaInfoForFile(file);
    const module = _.first(result.modules);
    const { meta } = require(metaFile);

    console.log(JSON.stringify(module, null, 2));
    expect(module).toEqual(meta);

    expect(result.hasErrors).toBe(false);
  });

describe('Schemas', () => {
  assertSchema('basic-interface');
  assertSchema('enum');
  assertSchema('mixed-types');
  assertSchema('basic-typeref');
});
