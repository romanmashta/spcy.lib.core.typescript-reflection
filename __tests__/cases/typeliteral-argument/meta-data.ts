import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  members: {
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
        },
        location: {
          typeRef: 'Property',
          arguments: [
            {
              properties: {
                lat: 'number',
                lon: 'number'
              }
            },
            {
              properties: {
                required: true,
                description: 'User location'
              }
            }
          ]
        }
      }
    }
  }
};
