import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Person: {
      type: 'object',
      required: ['firstName', 'lastName', 'role'],
      properties: {
        firstName: {
          $ref: '#/$defs/property'
        },
        lastName: {
          $ref: '#/$defs/property'
        },
        role: {
          $ref: '#/$defs/property'
        }
      }
    },
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
