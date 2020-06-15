import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Person: {
      type: 'object',
      required: ['firstName', 'lastName', 'role'],
      properties: {
        firstName: {
          $ref: '#/$defs/Property'
        },
        lastName: {
          $ref: '#/$defs/Property'
        },
        role: {
          $ref: '#/$defs/Property'
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
