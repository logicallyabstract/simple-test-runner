/**
 * Copyright (c) 2020-present, Logically Abstract, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-ignore
const { expect } = (window as any).chai;

/**
 * Simple test to check behavior
 *
 * Reference mocha and chai via the iframe parent
 */

describe('test class', () => {
  it('should pass', async () => {
    const { TestClass } = await import('./c');
    const c = new TestClass();
    expect(c.m()).to.equal('test2');
  });

  it('is a pending test');
});
