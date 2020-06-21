/**
 * Copyright (c) 2020-present, Logically Abstract, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable class-methods-use-this,@typescript-eslint/no-unused-vars */

/* Should be a plugin system */

import * as chalk from 'chalk';
import { v4 as uuid } from 'uuid';

export interface TestEnd {
  isFinished: boolean;
  exitCode?: number;
}

// TODO use lit-html here to get VSCode syntax highlights
const testScript = (path: string) =>
  `<script type="module" src="${path}"></script>`;

const createFrame = (path: string) => {
  const doc = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Test Runner for ${path}</title>
  <link href="/node_modules/mocha/mocha.css" type="text/css" rel="stylesheet">
</head>
<body>
  <div id="mocha"></div>
  <script src="/node_modules/mocha/mocha.js"></script>
  <script src="/node_modules/chai/chai.js"></script>
  <script src="/node_modules/sinon/pkg/sinon.js"></script>
  <script>
    mocha.setup('bdd');
    mocha.checkLeaks();
  </script>
  ${testScript(path)}
  <script type="module">
    const runner = mocha.run();

    const mapSuite = ({ delayed, pending, root, suites, tests, title }) => {
      return {
        delayed,
        pending,
        root,
        suites: suites.map((suite) => mapSuite(suite)),
        tests: tests.map((test) => mapTest(test)),
        title
      };
    };

    const mapTest = ({ async, err, pending, state, timedOut, title }) => {
      return {
        async,
        err,
        pending,
        state,
        timedOut,
        title
      };
    };

    if (window.parent && window.parent.test_onStart) {
      runner.on('start', () => {
        window.parent.test_onStart(window.name);
      });
    }

    if (window.parent && window.parent.test_onEnd) {
      runner.on('end', () => {
        window.parent.test_onEnd(window.name);
      });
    }

    if (window.parent && window.parent.test_onSuiteEnd) {
      runner.on('suite end', (event) => {
        window.parent.test_onSuiteEnd(window.name, mapSuite(event));
      });
    }
  </script>
</body>
</html>`;

  const cleanDoc = doc
    .replace(/\s{2,}/g, '')
    .replace(/\n/g, '')
    .replace(/<\/script>/g, '<\\/script>');

  return `
<script>
  (() => {
    const frame = document.createElement('iframe');
    frame.srcdoc = \`${cleanDoc}\`;
    frame.id = '${path}';
    frame.name = '${uuid()}';
    document.body.appendChild(frame);
  })();
</script>`;
};

const testHtml = (paths: string[] = []) => {
  const frames = paths.map((path) => createFrame(path));

  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Test Runner Parent</title>
  <style>
    iframe {
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: 1000px;
    }
  </style>
</head>
<body>
  <script>
    if (window.test_onReset) {
      window.test_onReset();
    }
  </script>
  ${frames.join('')}
</body>
</html>`;

  return html;
};

export const log = (str: string) => console.log(str); // eslint-disable-line no-console

export const spacing = (depth: number) => {
  return Array(depth).join('  ');
};

const testStates: any = {
  passed: '\u2714',
  failed: '\u2716',
  pending: '-',
};

const testColors: any = {
  passed: 'green',
  failed: 'red',
  pending: 'blue',
};

const c = chalk as any;

export const logTestRun = (test: any, depth: number) => {
  log(
    `${spacing(depth)}${c[testColors[test.state]](testStates[test.state])} ${
      test.title
    }`,
  );

  if (test.err && test.err.stack) {
    log(`\n${test.err.stack}\n`);
  }
};

export const logSuiteAndFindErrors = (
  suite: any,
  depth = 1,
  errors: any[] = [],
) => {
  if (suite.title) {
    log(`${spacing(depth)}${suite.title}`);
  }

  if (suite.suites.length) {
    suite.suites.forEach((childSuite: any) =>
      logSuiteAndFindErrors(childSuite, depth + 1, errors),
    );
  }

  if (suite.tests.length) {
    suite.tests.forEach((test: any) => {
      logTestRun(test, depth + 1);

      if (test.state === 'failed') {
        errors.push(test);
      }
    });
  }

  return errors;
};

export class BrowserPlugin {
  errors: any[] = [];

  fnNames = {
    onStart: 'test_onStart',
    onEnd: 'test_onEnd',
    onPass: 'test_onPass',
    onFail: 'test_onFail',
    onPending: 'test_onPending',
    onSuiteStart: 'test_onSuiteStart',
    onSuiteEnd: 'test_onSuiteEnd',
    onReset: 'test_onReset',
  };

  testPath = '/_test/test.html';

  excludedPaths = [
    'node_modules/mocha',
    'node_modules/chai',
    'node_modules/sinon',
  ];

  frameIndex: string[] = [];

  constructTestHtml(paths: string[] = []): string {
    return testHtml(paths);
  }

  onStart(_name: string, _event: any) {
    this.frameIndex.push(_name);
    log(chalk.blue(`Starting iframe suite ${this.frameIndex.length}...\n`));
  }

  onEnd(_name: string, _event: any): any[] {
    return this.errors;
  }

  onPass(_name: string, _event: any) {}

  onFail(_name: string, _event: any) {}

  onPending(_name: string, _event: any) {}

  onSuiteStart(_name: string, _event: any) {}

  onSuiteEnd(_name: string, event: any) {
    if (event.root) {
      const idx = this.frameIndex.indexOf(_name);
      log(chalk.blue(`\nTests from iframe ${idx + 1} complete:`));
      const errors = logSuiteAndFindErrors(event);
      this.errors.push(...errors);
    }
  }

  onReset() {
    this.errors = [];
    this.frameIndex = [];
  }
}
