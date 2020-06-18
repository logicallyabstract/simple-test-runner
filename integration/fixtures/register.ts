/**
 * Copyright (c) 2020-present, Logically Abstract, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createRegisterWc } from '@logicallyabstract/register-wc';

export const {
  registerWc,
  createException,
  removeException,
} = createRegisterWc(process.env.WC_TEST === 'true');
