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

export interface CollectionBase {
  count: number;
}

export interface Collection<T, U> extends CollectionBase {
  meta: U;
  items: T[];
}

export type Persons = Collection<Person, Meta>;
