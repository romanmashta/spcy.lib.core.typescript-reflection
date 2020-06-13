export type TypeInfo = ObjectType | SimpleType | ArrayType | TypeReference | EnumType | ConstLiteral | OneOf | AllOf;

export interface TypeReference {
  $ref: string;
}

export interface ArrayType {
  type: 'array';
  items: TypeInfo;
}

export interface ConstLiteral {
  const: string | number | boolean | null;
}

export interface EnumType {
  enum: string[];
}

export interface SimpleType {
  type: 'string' | 'number' | 'boolean' | 'date' | 'null';
}

export interface ObjectType {
  type: 'object';
  properties?: {
    [name: string]: TypeInfo;
  };
  additionalProperties?: TypeInfo | boolean;
}

export interface OneOf {
  oneOf: TypeInfo[];
}

export interface AllOf {
  allOf: TypeInfo[];
}

export interface Module {
  $defs: {
    [name: string]: TypeInfo;
  };
}

export interface MetaInfo {
  modules: Module[];
  hasErrors: boolean;
}
