import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Person: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        },
        age: {
          type: 'number'
        },
        isActive: {
          type: 'boolean'
        }
      }
    }
  }
};
