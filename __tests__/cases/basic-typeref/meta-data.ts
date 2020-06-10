import { Module } from '../../../src/meta-data';

export const meta: Module = {
  members: {
    Location: {
      interface: {
        properties: {
          lat: 'number',
          lon: 'number'
        }
      }
    },
    Person: {
      interface: {
        properties: {
          firstName: 'string',
          lastName: 'string',
          age: 'number',
          isActive: 'boolean',
          location: {
            typeRef: 'Location'
          },
          role: {
            typeRef: 'Role'
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
