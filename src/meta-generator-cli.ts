import yargs from 'yargs';
import { exec, getDefaultOptions } from './meta-generator';

export const run = () => {
  const helpText = 'Usage: tsr';
  const defaultArgs = getDefaultOptions();
  const args = yargs
    .usage(helpText)
    .string('path')
    .string('reflection-module')
    .array('includes')
    .boolean('skip-model-reg')
    .default('path', defaultArgs.path)
    .default('reflection-module', defaultArgs.reflectionModule)
    .default('includes', defaultArgs.includes)
    .default('skip-model-reg', defaultArgs.includes)
    .describe('path', 'Path to package.json')
    .describe('includes', 'Additional files')
    .describe('skip-model-reg', 'Skip Model Registration').argv;

  exec({ path: args.path, includes: args.includes, reflectionModule: args['reflection-module'] });
};

if (typeof window === 'undefined' && require.main === module) {
  run();
}
