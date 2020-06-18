/**
 * Copyright (c) 2020-present, Logically Abstract, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { execSync } from 'child_process';

const fail = (str: string) => {
  console.log('Test failed\n'); // eslint-disable-line no-console
  console.log(str); // eslint-disable-line no-console
  process.exit(1);
};

try {
  execSync(
    './node_modules/.bin/ts-node src/cli.ts integration/fixtures/**/*.test.ts',
    {
      cwd: process.cwd(),
    },
  );
} catch (err) {
  // command should exit with 1 because we are testing that there is actually a failing unit test

  const str = err.stdout.toString();

  if (!str.includes('Tests from iframe 1 complete:')) {
    fail(str);
  }

  if (!str.includes('Tests from iframe 2 complete:')) {
    fail(str);
  }

  if (!str.includes('✖ should pass')) {
    fail(str);
  }

  if (!str.includes("expected 'test' to equal 'test2'")) {
    fail(str);
  }

  if (!str.includes('should pass')) {
    fail(str);
  }

  if (!str.includes('- is a pending test')) {
    fail(str);
  }

  if (!str.includes('✔ should not render the inner html for element a')) {
    fail(str);
  }

  console.log('test passed'); // eslint-disable-line no-console

  process.exit(0);
}
