/**
 * Copyright (c) 2020-present, Logically Abstract, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createException, removeException } from './register';

const { expect } = chai;
const { resetHistory } = window.sinon;

describe('testing element mocking', () => {
  class ElementA extends HTMLElement {
    connectedCallback() {
      this.innerHTML = 'Faked';
    }
  }

  let div: HTMLDivElement;

  before(async () => {
    customElements.define('element-a', ElementA);
    createException('element-a');

    // import the element to be tested here to prevent a memory leak error from mocha
    await import('./element-b');
  });

  after(() => {
    removeException('element-a');
  });

  afterEach(() => {
    resetHistory();
    document.body.removeChild(div);
  });

  it('should not render the inner html for element a', () => {
    div = document.createElement('div');
    div.innerHTML = '<element-b></element-b>';
    document.body.appendChild(div);

    expect(div.innerHTML).to.contain('Faked');
  });
});
