/**
 * Copyright (c) 2020-present, Logically Abstract, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  extends: ['airbnb-typescript/base', 'prettier'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-default-export': ['error'],
    'spaced-comment': 'off',
  },
  overrides: [
    {
      files: ['fixtures/static/**', '*.test.ts'],
      rules: {
        // do not require test/fixture imports to be in main deps
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['integration/**/*'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
      },
    },
  ],
};
