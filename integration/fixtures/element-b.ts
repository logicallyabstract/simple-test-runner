/**
 * Copyright (c) 2020-present, Logically Abstract, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import './element-a';
import { registerWc } from './register';

export class MyElementB extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<h1>I include an element.</h1><element-a></element-a>';
  }
}

registerWc('element-b', MyElementB);
