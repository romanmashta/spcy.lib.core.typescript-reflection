export type TypeInfo =
  | ObjectType
  | StringType
  | BooleanType
  | NumberType
  | DateType
  | NullType
  | ArrayType
  | TypeReference
  | EnumType
  | ConstLiteral
  | OneOf
  | AllOf;

export interface TypeReference {
  $id?: string;
  $ref: string;
  $refPackage?: string;
  $arguments?: TypeReference[];
}

export interface ArrayType {
  $id?: string;
  type: 'array';
  items: TypeInfo;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

export interface ConstLiteral {
  $id?: string;
  const: string | number | boolean | null;
}

export interface EnumType {
  $id?: string;
  enum: string[];
}

export interface NullType {
  $id?: string;
  type: 'null';
}

export interface DateType {
  $id?: string;
  type: 'date';
}

export interface BooleanType {
  $id?: string;
  type: 'boolean';
}

export interface StringType {
  $id?: string;
  type: 'string';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface NumberType {
  $id?: string;
  type: 'number';
  minimum?: number;
  maximum?: number;
}

export interface ObjectType {
  $id?: string;
  type: 'object';
  required?: string[];
  properties?: {
    [name: string]: TypeInfo;
  };
  additionalProperties?: TypeInfo | boolean;
}

export interface OneOf {
  $id?: string;
  oneOf: TypeInfo[];
}

export interface AllOf {
  $id?: string;
  allOf: TypeInfo[];
}

export interface Module {
  $id?: string;
  $defs: {
    [name: string]: TypeInfo;
  };
}
