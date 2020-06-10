import { Module } from '../../../src/meta-data';

export const meta: Module = {
  members: {
    Role: {
      enum: {
        Guest: 'Guest',
        User: 'User',
        Admin: 'Admin'
      }
    }
  }
};
