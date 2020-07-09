export interface Person {
  firstName: string;
  lastName: string;
  age?: number;
  isActive?: boolean;
}

export interface Meta {
  count: number;
  fetchTime: number;
}

export interface Collection<T, U> {
  meta: U;
  items: T[];
}

export type Persons = Collection<Person, Meta>;
