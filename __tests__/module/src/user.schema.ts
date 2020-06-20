import { TypeInfo } from '@spcy/lib.core.reflection';

export const LocationSchema: TypeInfo = {
  $id: '@spcy/lib.core.test-module/Location',
  type: 'object',
  required: ['lat', 'lon', 'type'],
  properties: {
    lat: {
      type: 'number'
    },
    lon: {
      type: 'number'
    },
    type: {
      $ref: '@spcy/lib.core.test-module/LocationType'
    }
  }
};

export const PersonSchema: TypeInfo = {
  $id: '@spcy/lib.core.test-module/Person',
  type: 'object',
  required: ['firstName', 'lastName', 'age', 'isActive', 'location'],
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
    },
    location: {
      $ref: '@spcy/lib.core.test-module/Location'
    }
  }
};

export const LocationTypeSchema: TypeInfo = {
  oneOf: [
    {
      const: 'Work'
    },
    {
      const: 'Home'
    },
    {
      const: 'Other'
    }
  ]
};
