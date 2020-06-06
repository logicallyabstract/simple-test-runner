import { createRegisterWc } from '@logicallyabstract/register-wc';

export const {
  registerWc,
  createException,
  removeException,
} = createRegisterWc(process.env.WC_TEST === 'true');
