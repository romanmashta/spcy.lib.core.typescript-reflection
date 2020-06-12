import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  members: {
    Person: {
      properties: {
        firstName: 'string',
        lastName: 'string',
        age: 'number',
        isActive: 'boolean'
      }
    }
  }
};
