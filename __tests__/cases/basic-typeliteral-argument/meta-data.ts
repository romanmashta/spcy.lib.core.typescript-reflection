import { Module } from '../../../src/meta-data';

export const meta: Module = {
  members: {
    Person: {
      interface: {
        properties: {
          firstName: {
            typeRef: 'Property',
            arguments: ['string']
          },
          lastName: {
            typeRef: 'Property',
            arguments: ['string']
          },
          role: {
            typeRef: 'Property',
            arguments: [{ typeRef: 'Role' }]
          }
        }
      }
    },
    Role: {
      enum: {
        Guest: 'Guest',
        User: 'User',
        Admin: 'Admin'
      }
    }
  }
};
