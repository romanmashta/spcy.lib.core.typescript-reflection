import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Config: {
      type: 'object',
      additionalProperties: {
        $ref: '#/$defs/Section'
      }
    },
    Section: {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        secret: {
          type: 'string'
        }
      }
    }
  }
};
