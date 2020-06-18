#!/usr/bin/env node

/**
 * Copyright (c) 2020-present, Logically Abstract, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
