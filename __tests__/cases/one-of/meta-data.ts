import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Shapes: {
      oneOf: [
        {
          $ref: '#/$defs/Circle'
        },
        {
          $ref: '#/$defs/Square'
        }
      ]
    },
    Picture: {
      type: 'object',
      required: ['figures'],
      properties: {
        figures: {
          type: 'array',
          items: {
            $ref: '#/$defs/Shapes'
          }
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
