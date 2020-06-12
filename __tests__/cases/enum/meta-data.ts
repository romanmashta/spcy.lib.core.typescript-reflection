import { Module } from '@spcy/lib.core.reflection';

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
