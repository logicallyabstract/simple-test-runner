# simple-test-runner

## Get Started

`npm install --save @logicallyabstract/simple-test-runner`

`npx simple-test-runner src/**/*.test.ts --debug`

Mocha, chai, and sinon are provided as globals. The test runner runs each test file in an iframe.

## Mocking child components in a test

**child-component.ts**

```typescript
import { registerCustomElement } from '@logicallyabstract/simple-test-server';

export class ChildComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<h1>Test</h1>';
  }
}

registerCustomElement('child-component', SampleComponent);
```

**sample-component.ts**

```typescript
import { registerCustomElement } from '@logicallyabstract/simple-test-server';

export class SampleComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<child-component></child-component>';
  }
}

registerCustomElement('sample-component', SampleComponent);
```

**sample-component.test.ts**

```typescript
import { createException, removeException } from '../../src/browser/helpers';

class FakeChildComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = 'Faked';
  }
}

describe('suite', () => {
  before(() => {
    customElements.define('child-component', FakeChildComponent);
    createException('child-component');
  });

  after(() => {
    removeException('child-component');
  });

  it('should do a thing', async () => {
    await import('./sample-component');

    const div = document.createElement('div');
    div.innerHTML = '<sample-component></sample-component>';
    document.body.appendChild(div);

    // assertions
  });
});
```
