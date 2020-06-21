import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    Entity: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string'
        }
      }
    },
    Audit: {
      type: 'object',
      required: ['createdOn', 'updatedOn'],
      properties: {
        createdOn: {
          type: 'string'
        },
        updatedOn: {
          type: 'string'
        }
      }
    },
    Person: {
      allOf: [
        {
          $ref: '#/$defs/Audit'
        },
        {
          $ref: '#/$defs/Entity'
        },
        {
          type: 'object',
          required: ['firstName', 'lastName'],
          properties: {
            firstName: {
              type: 'string'
            },
            lastName: {
              type: 'string'
            },
            age: {
              type: 'number'
            },
            isActive: {
              type: 'boolean'
            }
          }
        }
      ]
    }
  }
};
