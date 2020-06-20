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
  $ref: string;
}

export interface ArrayType {
  type: 'array';
  items: TypeInfo;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

export interface ConstLiteral {
  const: string | number | boolean | null;
}

export interface EnumType {
  enum: string[];
}

export interface NullType {
  type: 'null';
}

export interface DateType {
  type: 'date';
}

export interface BooleanType {
  type: 'boolean';
}

export interface StringType {
  type: 'string';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface NumberType {
  type: 'number';
  minimum?: number;
  maximum?: number;
}

export interface ObjectType {
  type: 'object';
  required?: string[];
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

export interface SourceFile {
  fileName: string;
  module: Module;
}

export interface MetaInfo {
  sourceFiles: SourceFile[];
  modules: Module[];
  hasErrors: boolean;
}
