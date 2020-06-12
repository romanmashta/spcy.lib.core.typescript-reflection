import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  members: {
    Person: {
      properties: {
        firstName: 'string',
        lastName: 'string',
        location: {
          properties: {
            lat: 'number',
            lon: 'number'
          }
        }
      }
    }
  }
};
