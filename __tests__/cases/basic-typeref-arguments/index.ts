type Property<T> = T;

export interface Person {
  firstName: Property<string>;
  lastName: Property<string>;
  role: Property<Role>;
}

export enum Role {
  Guest,
  User,
  Admin
}
