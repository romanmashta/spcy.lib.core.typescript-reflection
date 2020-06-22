export interface Location {
  lat: number;
  lon: number;
}

export interface Person {
  firstName: string;
  lastName: string;
  age: number;
  isActive: boolean;
  location: Location;
  role: Role;
}

export enum Role {
  Guest,
  User,
  Admin
}
