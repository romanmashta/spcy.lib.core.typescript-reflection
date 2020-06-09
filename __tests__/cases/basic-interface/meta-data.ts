import { Module } from '../../../src/meta-data';

export const meta: Module = {
  required: {
    from: 'lib.core.meta'
  },
  Entity: {
    interface: {
      properties: {
        id: {
          typeRef: '.required',
          arguments: ['number']
        }
      }
    }
  },
  Person: {
    interface: {
      extends: { typeRef: '.Entity' },
      properties: {
        firstName: 'string'
      }
    }
  },
  Role: {
    enum: {
      User: 0,
      Admin: 1
    }
  }
};
