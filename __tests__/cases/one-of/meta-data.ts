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
