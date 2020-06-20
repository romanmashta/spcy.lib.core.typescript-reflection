import yargs from 'yargs';
import { exec } from './meta-generator';

export const run = () => {
  const helpText = 'Usage: typescript-reflection <path-to-package-json>';
  const args = yargs.usage(helpText).demand(1).argv;

  exec(args._[0]);
};

if (typeof window === 'undefined' && require.main === module) {
  run();
}
