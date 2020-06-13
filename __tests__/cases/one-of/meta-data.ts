import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Decorator: {
      type: 'object',
      properties: {
        figure: {
          oneOf: [
            {
              $ref: '#/$defs/Circle'
            },
            {
              $ref: '#/$defs/Square'
            }
          ]
        }
      }
    },
    Circle: {
      type: 'object',
      properties: {
        radius: {
          type: 'number'
        }
      }
    },
    Square: {
      type: 'object',
      properties: {
        side: {
          type: 'number'
        }
      }
    }
  }
};
