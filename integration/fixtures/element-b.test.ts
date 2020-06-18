/**
 * Copyright (c) 2020-present, Logically Abstract, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* global sinon */

import { createException, removeException } from './register';

// @ts-ignore
const { expect } = (window as any).chai;
// @ts-ignore
const { resetHistory } = sinon;

describe('testing element mocking', () => {
  class ElementA extends HTMLElement {
    connectedCallback() {
      this.innerHTML = 'Faked';
    }
  }

  let div: HTMLDivElement;

  before(() => {
    customElements.define('element-a', ElementA);
    createException('element-a');
  });

  after(() => {
    removeException('element-a');
  });

  afterEach(() => {
    resetHistory();
    document.body.removeChild(div);
  });

  it('should not render the inner html for element a', async () => {
    await import('./element-b');
    div = document.createElement('div');
    div.innerHTML = '<element-b></element-b>';
    document.body.appendChild(div);

    expect(div.innerHTML).to.contain('Faked');
  });
});
