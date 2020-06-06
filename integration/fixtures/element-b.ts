import './element-a';
import { registerWc } from './register';

export class MyElementB extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<h1>I include an element.</h1><element-a></element-a>';
  }
}

registerWc('element-b', MyElementB);
