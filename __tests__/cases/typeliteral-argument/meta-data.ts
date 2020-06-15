import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Person: {
      type: 'object',
      required: ['firstName', 'lastName', 'location'],
      properties: {
        firstName: {
          $ref: '#/$defs/Property'
        },
        lastName: {
          $ref: '#/$defs/Property'
        },
        location: {
          $ref: '#/$defs/Property'
        }
      }
    }
  }
};
