import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  members: {
    Person: {
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
