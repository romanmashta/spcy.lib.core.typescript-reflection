export interface Location {
  lat: number;
  lon: number;
  type: LocationType;
}

export interface Person {
  firstName: string;
  lastName: string;
  age: number;
  isActive: boolean;
  location: Location;
}

export enum LocationType {
  Work,
  Home,
  Other
}
