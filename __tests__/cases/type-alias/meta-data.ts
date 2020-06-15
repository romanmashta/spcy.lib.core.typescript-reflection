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
      required: ['figure'],
      properties: {
        figure: {
          $ref: '#/$defs/Figure'
        }
      }
    },
    Circle: {
      type: 'object',
      required: ['radius'],
      properties: {
        radius: {
          type: 'number'
        }
      }
    },
    Square: {
      type: 'object',
      required: ['side'],
      properties: {
        side: {
          type: 'number'
        }
      }
    }
  }
};
