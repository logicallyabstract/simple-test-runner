#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-unused-expressions */

import * as yargs from 'yargs';
import { TestRunner } from './runner';

const run = () => {
  yargs
    .command(
      '$0 [glob]',
      'Run the test runner',
      (cli) => {
        return cli
          .positional('glob', {
            describe: 'Glob string of tests to run',
            type: 'string',
            default: 'src/**/*.test.ts',
          })
          .option('debug', {
            describe: 'Pause the browser until it is manually killed.',
            type: 'boolean',
            default: false,
          });
      },
      (argv) => {
        const runner = new TestRunner();
        runner.run(argv.glob, argv.debug);
      },
    )
    .help().argv;
};

run();
