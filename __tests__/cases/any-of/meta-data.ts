import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  members: {
    Decorator: {
      properties: {
        figure: {
          anyOf: [
            {
              typeRef: 'Circle'
            },
            {
              typeRef: 'Square'
            }
          ]
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
