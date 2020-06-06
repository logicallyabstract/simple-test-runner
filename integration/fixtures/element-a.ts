import { registerWc } from './register';

export class MyElementA extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<h1>I ran from inside the element.</h1>';
  }
}

registerWc('element-a', MyElementA);
