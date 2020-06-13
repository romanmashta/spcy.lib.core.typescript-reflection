import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Figure: {
      oneOf: [
        {
          $ref: '#/$defs/Circle'
        },
        {
          $ref: '#/$defs/Square'
        }
      ]
    },
    Decorator: {
      type: 'object',
      properties: {
        figure: {
          $ref: '#/$defs/Figure'
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
