import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  members: {
    Config: {
      properties: {
        colors: {
          array: 'string'
        },
        params: {
          array: {
            properties: {
              key: 'string',
              value: 'string'
            }
          }
        }
      }
    }
  }
};
