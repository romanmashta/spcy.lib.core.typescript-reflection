import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Person: {
      type: 'object',
      required: ['firstName', 'lastName', 'location'],
      properties: {
        firstName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        },
        location: {
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
        }
      }
    }
  }
};
