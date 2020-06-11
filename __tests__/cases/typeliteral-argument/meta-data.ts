import { Module } from '../../../src/meta-data';

export const meta: Module = {
  members: {
    ExtraInfo: {
      properties: {
        required: 'boolean',
        count: 'number',
        description: 'string',
        some: 'string'
      }
    },
    Person: {
      properties: {
        firstName: {
          typeRef: 'Property',
          arguments: [
            'string',
            {
              properties: {
                required: true,
                count: 10,
                description: 'First Name',
                some: null
              }
            }
          ]
        },
        lastName: {
          typeRef: 'Property',
          arguments: [
            'string',
            {
              properties: {
                required: true,
                description: 'Last Name'
              }
            }
          ]
        }
      }
    }
  }
};
