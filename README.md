# simple-test-runner

A test runner to run each test file in its own iframe in a browser.

## Get Started

`npm install --save @logicallyabstract/simple-test-runner`

`npx simple-test-runner src/**/*.test.ts --debug`

Mocha, chai, and sinon are provided as globals. The test runner runs each test file in an iframe.

The `--debug` flag will keep the browser open, otherwise the tests will run in a headless browser and quit after the tests are complete.
