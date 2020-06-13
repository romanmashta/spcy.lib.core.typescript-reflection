import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Role: {
      oneOf: [
        {
          const: 'Guest'
        },
        {
          const: 'User'
        },
        {
          const: 'Admin'
        }
      ]
    }
  }
};
