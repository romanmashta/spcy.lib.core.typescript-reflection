import { Module } from '../../../src/meta-data';

export const meta: Module = {
  members: {
    ExtraInfo: {
      interface: {
        properties: {
          required: 'boolean',
          description: 'string'
        }
      }
    },
    Person: {
      interface: {
        properties: {
          firstName: {
            typeRef: 'Property',
            arguments: ['string', 'string']
          },
          lastName: {
            typeRef: 'Property',
            arguments: ['string', 'string']
          }
        }
      }
    }
  }
};
