import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Location: {
      type: 'object',
      required: ['lat', 'lon'],
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
      required: ['firstName', 'lastName', 'age', 'isActive', 'location', 'role'],
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
