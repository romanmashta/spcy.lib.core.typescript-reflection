import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Person: {
      type: 'object',
      required: ['firstName', 'lastName', 'location'],
      properties: {
        firstName: {
          $ref: '#/$defs/property'
        },
        lastName: {
          $ref: '#/$defs/property'
        },
        location: {
          $ref: '#/$defs/property'
        }
      }
    }
  }
};
