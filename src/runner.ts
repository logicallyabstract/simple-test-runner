/**
 * Copyright (c) 2020-present, Logically Abstract, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSimpleDevServerApp } from '@logicallyabstract/simple-dev-server';
import { sync } from 'glob';
import { Server } from 'http';
import { chromium, ChromiumBrowser } from 'playwright';
import { BrowserPlugin } from './plugins/browser-wc';
import { MochaPlugin } from './plugins/mocha-wc';

export class TestRunner {
  server?: Server;

  browser?: ChromiumBrowser;

  plugin: BrowserPlugin;

  constructor() {
    this.plugin = new MochaPlugin();

    this.closeServerOnKill();
  }

  closeServerOnKill() {
    const terminationSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP'];
    terminationSignals.forEach((signal) => {
      process.on(signal as any, () => this.kill(1));
    });
  }

  async stop() {
    if (this.browser) {
      await this.browser.close();
    }

    if (this.server) {
      this.server.close();
    }
  }

  async kill(exitCode: number) {
    await this.stop();

    process.exit(exitCode);
  }

  async run(glob: string, debug = false) {
    process.env.WC_TEST = 'true';
    const paths = sync(glob);

    const jsPaths = paths.map((path) => {
      return `/${path.replace('.ts', '.js')}`;
    });

    const app = createSimpleDevServerApp(this.plugin.excludedPaths);

    let suiteCount = paths.length;

    app.use((ctx: any) => {
      if (ctx.path === this.plugin.testPath) {
        ctx.body = this.plugin.constructTestHtml(jsPaths);
        ctx.status = 200;
      }
    });

    this.server = app.listen(9099);

    this.browser = await chromium.launch({
      headless: !debug,
    });

    const context = await this.browser.newContext();
    const page = await context.newPage();

    await page.exposeFunction(
      this.plugin.fnNames.onStart,
      (name: string, event: any) => {
        this.plugin.onStart(name, event);
      },
    );

    await page.exposeFunction(
      this.plugin.fnNames.onEnd,
      async (name: string, event: any) => {
        const errors = this.plugin.onEnd(name, event);

        suiteCount -= 1;

        if (debug) {
          return;
        }

        if (suiteCount > 0) {
          return;
        }

        // TODO add watch mode

        const exitCode = errors.length ? 1 : 0;
        await this.kill(exitCode);
      },
    );

    await page.exposeFunction(
      this.plugin.fnNames.onPass,
      (name: string, event: any) => {
        this.plugin.onPass(name, event);
      },
    );

    await page.exposeFunction(
      this.plugin.fnNames.onFail,
      (name: string, event: any) => {
        this.plugin.onFail(name, event);
      },
    );

    await page.exposeFunction(
      this.plugin.fnNames.onPending,
      (name: string, event: any) => {
        this.plugin.onPending(name, event);
      },
    );

    await page.exposeFunction(
      this.plugin.fnNames.onSuiteStart,
      (name: string, event: any) => {
        this.plugin.onSuiteStart(name, event);
      },
    );

    await page.exposeFunction(
      this.plugin.fnNames.onSuiteEnd,
      (name: string, event: any) => {
        this.plugin.onSuiteEnd(name, event);
      },
    );

    await page.goto(`http://localhost:9099${this.plugin.testPath}`);
  }
}
