import { property } from '@spcy/lib.core.reflection';

export interface Person {
  firstName: property<string>;
  lastName: property<string>;
  role: property<Role>;
}

export enum Role {
  Guest,
  User,
  Admin
}
