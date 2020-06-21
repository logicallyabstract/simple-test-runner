/**
 * Copyright (c) 2020-present, Logically Abstract, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSimpleDevServerApp } from '@logicallyabstract/simple-dev-server';
import { sync } from 'glob';
import { chromium } from 'playwright';
import { TestRunner } from './runner';

jest.mock('@logicallyabstract/simple-dev-server');
jest.mock('glob');
jest.mock('http');
jest.mock('playwright');

describe('runner', () => {
  beforeEach(() => {});

  it('should register kill signals', () => {
    const processOnSpy = jest.spyOn(process, 'on');
    const instance = new TestRunner();
    expect(instance).toBeDefined();
    expect(processOnSpy).toHaveBeenCalledTimes(4);
    jest.restoreAllMocks();
  });

  it('should run to completion', async () => {
    const fakeServer: any = {
      close: jest.fn(),
    };

    const fakeApp: any = {
      listen: jest.fn().mockImplementation(() => {
        return fakeServer;
      }),
      use: jest.fn(),
    };

    const fakePage: any = {
      exposeFunction: jest.fn(),
      goto: jest.fn().mockResolvedValue(undefined),
    };

    const fakeContext: any = {
      newPage: jest.fn().mockResolvedValue(fakePage),
    };

    const fakeBrowser: any = {
      newContext: jest.fn().mockResolvedValue(fakeContext),
    };

    (createSimpleDevServerApp as jest.Mock).mockImplementation(() => {
      return fakeApp;
    });

    (chromium.launch as jest.Mock).mockResolvedValue(fakeBrowser);

    (sync as jest.Mock).mockImplementation(() => {
      return ['/t.ts', '/a.ts'];
    });

    const runner = new TestRunner();
    await runner.run('notfound');

    expect(chromium.launch).toHaveBeenCalledTimes(1);
    expect(fakeBrowser.newContext).toHaveBeenCalledTimes(1);
    expect(fakeContext.newPage).toHaveBeenCalledTimes(1);
    expect(fakePage.exposeFunction).toHaveBeenCalledTimes(8);
    expect(fakePage.goto).toHaveBeenCalledTimes(1);
  });

  it('should run stop', async () => {
    const runner = new TestRunner();

    const fakeServer = {
      close: jest.fn(),
    };

    const fakeBrowser = {
      close: jest.fn().mockResolvedValue(undefined),
    };

    runner.browser = fakeBrowser as any;
    runner.server = fakeServer as any;

    await runner.stop();

    expect(fakeServer.close).toHaveBeenCalledTimes(1);
    expect(fakeBrowser.close).toHaveBeenCalledTimes(1);
  });
});
