interface PropertyAttributes {
  required?: boolean;
}

export type property<T, X extends PropertyAttributes = undefined> = T;
