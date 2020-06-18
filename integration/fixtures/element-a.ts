/**
 * Copyright (c) 2020-present, Logically Abstract, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { registerWc } from './register';

export class MyElementA extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<h1>I ran from inside the element.</h1>';
  }
}

registerWc('element-a', MyElementA);
