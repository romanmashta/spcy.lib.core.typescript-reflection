import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Person: {
      type: 'object',
      required: ['email', 'age', 'name'],
      properties: {
        email: {
          type: 'string',
          pattern: '.*'
        },
        age: {
          type: 'number',
          minimum: 1,
          maximum: 99
        },
        name: {
          type: 'string'
        }
      }
    }
  }
};
