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
        location: {
          type: 'object',
          properties: {
            lat: {
              type: 'number'
            },
            lon: {
              type: 'number'
            }
          }
        }
      }
    }
  }
};
