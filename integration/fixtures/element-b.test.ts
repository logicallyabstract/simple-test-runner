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
