import yargs from 'yargs';
import { exec, getDefaultOptions } from './meta-generator';

export const run = () => {
  const helpText = 'Usage: tsr';
  const defaultArgs = getDefaultOptions();
  const args = yargs
    .usage(helpText)
    .string('path')
    .default('path', defaultArgs.path)
    .describe('path', 'Path to package.json')
    .array('includes')
    .default('includes', defaultArgs.includes)
    .describe('includes', 'Additional files').argv;

  exec({ path: args.path, includes: args.includes });
};

if (typeof window === 'undefined' && require.main === module) {
  run();
}
