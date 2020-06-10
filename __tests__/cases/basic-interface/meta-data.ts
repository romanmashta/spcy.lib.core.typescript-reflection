import { Module } from '../../../src/meta-data';

export const meta: Module = {
  members: {
    Person: {
      interface: {
        properties: {
          firstName: 'string',
          lastName: 'string',
          age: 'number',
          isActive: 'boolean'
        }
      }
    }
  }
};
