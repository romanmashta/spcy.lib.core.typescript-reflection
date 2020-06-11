import { Module } from '../../../src/meta-data';

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
