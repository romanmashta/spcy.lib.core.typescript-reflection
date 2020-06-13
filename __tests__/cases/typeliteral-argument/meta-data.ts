import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Person: {
      type: 'object',
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
