import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Config: {
      type: 'object',
      properties: {
        colors: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        params: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: {
                type: 'string'
              },
              value: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  }
};
