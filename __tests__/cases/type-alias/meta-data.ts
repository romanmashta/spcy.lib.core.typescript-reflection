import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  members: {
    Figure: {
      anyOf: [
        {
          typeRef: 'Circle'
        },
        {
          typeRef: 'Square'
        }
      ]
    },
    Decorator: {
      properties: {
        figure: {
          typeRef: 'Figure'
        }
      }
    },
    Circle: {
      properties: {
        radius: 'number'
      }
    },
    Square: {
      properties: {
        side: 'number'
      }
    }
  }
};
