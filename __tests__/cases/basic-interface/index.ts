interface PropertyAttributes {
  required?: boolean;
  validationMessage?: string;
}

type property<T, X extends PropertyAttributes = undefined> = T;

export interface Entity {
  id: property<number>;
}

export interface Person extends Entity {
  name: string;
}

export enum Role {
  User,
  Admin,
  Guest
}
