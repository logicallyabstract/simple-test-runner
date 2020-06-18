/**
 * Copyright (c) 2020-present, Logically Abstract, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as mod from './browser-wc';

const { BrowserPlugin, spacing, logTestRun, logSuiteAndFindErrors } = mod;

describe('browser-wc', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should construct a plugin', () => {
    const plugin = new BrowserPlugin();
    expect(plugin).toBeDefined();
  });

  it('should set spacing', () => {
    const space = spacing(4);
    expect(space.split(' ').length).toBe(7);
  });

  it('should construct the test html', () => {
    const plugin = new BrowserPlugin();
    const str = plugin.constructTestHtml(['/test.ts', '/test-2.ts']);

    expect(str).toContain('src="/test.ts');
    expect(str).toContain('src="/test-2.ts');
  });

  it('should not error on base methods', () => {
    const plugin = new BrowserPlugin();

    const name = 'abc';
    const event: any = {};

    plugin.onPass(name, event);
    plugin.onFail(name, event);
    plugin.onPending(name, event);
    plugin.onSuiteStart(name, event);
  });

  it('should increase the suite count on start', () => {
    const logSpy = jest.spyOn(mod, 'log').mockImplementation(() => {});

    const plugin = new BrowserPlugin();

    const name = 'abc';
    const event: any = {};

    plugin.onStart(name, event);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(plugin.frameIndex.length).toBe(1);
  });

  it('should return errors on end', () => {
    const plugin = new BrowserPlugin();

    const name = 'abc';
    const event: any = {};

    plugin.errors = [{}, {}];

    const errors = plugin.onEnd(name, event);

    expect(errors.length).toBe(2);
  });

  it('should add errors on suite end for root', () => {
    const logSpy = jest.spyOn(mod, 'log').mockImplementation(() => {});
    const plugin = new BrowserPlugin();

    const name = 'abc';
    const event: any = {
      suites: [],
      tests: [
        {
          state: 'failed',
        },
      ],
      root: true,
    };

    plugin.frameIndex = [name];

    plugin.onSuiteEnd(name, event);

    expect(plugin.errors.length).toBe(1);
    expect(logSpy).toHaveBeenCalled();
  });

  it('should not add errors on suite end for non-root', () => {
    const logSpy = jest.spyOn(mod, 'log').mockImplementation(() => {});
    const plugin = new BrowserPlugin();

    const name = 'abc';
    const event: any = {
      suites: [],
      tests: [
        {
          state: 'failed',
        },
      ],
    };

    plugin.frameIndex = [name];

    plugin.onSuiteEnd(name, event);

    expect(plugin.errors.length).toBe(0);
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('should log stack on an error', () => {
    const logSpy = jest.spyOn(mod, 'log').mockImplementation(() => {});

    logTestRun(
      {
        state: 'failed',
        title: 'A title',
        err: {
          stack: 'a stack',
        },
      },
      1,
    );

    expect(logSpy).toHaveBeenCalledTimes(2);

    const callArg = logSpy.mock.calls[1][0];

    expect(callArg).toContain('a stack');
  });

  it('should log and find errors', () => {
    const logSpy = jest.spyOn(mod, 'log').mockImplementation(() => {});

    const errors: any = [];

    logSuiteAndFindErrors(
      {
        suites: [
          {
            title: 'a title',
            suites: [],
            tests: [
              {
                state: 'failed',
              },
            ],
          },
        ],
        tests: [],
      },
      1,
      errors,
    );

    expect(logSpy).toHaveBeenCalled();

    expect(errors.length).toBe(1);
  });
});
