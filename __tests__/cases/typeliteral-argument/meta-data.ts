import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Person: {
      type: 'object',
      required: ['email', 'age'],
      properties: {
        email: {
          $ref: '#/$defs/property'
        },
        age: {
          $ref: '#/$defs/property'
        }
      }
    }
  }
};
