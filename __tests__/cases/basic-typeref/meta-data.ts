import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Location: {
      type: 'object',
      properties: {
        lat: {
          type: 'number'
        },
        lon: {
          type: 'number'
        }
      }
    },
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
        },
        location: {
          $ref: '#/$defs/Location'
        },
        role: {
          $ref: '#/$defs/Role'
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
