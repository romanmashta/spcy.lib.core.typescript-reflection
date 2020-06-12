export type BasicTypes = 'boolean' | 'number' | 'string';
export type LiteralType = string | number | boolean | null;

export interface TypeReference {
  typeRef: string;
  arguments?: TypeInfo[];
}

export interface TypeLiteral {
  properties?: {
    [name: string]: TypeInfo;
  };
  index?: TypeInfo;
}

export interface UnionType {
  anyOf: TypeInfo[];
}

export interface ArrayType {
  array: TypeInfo;
}

export type TypeInfo = BasicTypes | TypeReference | TypeLiteral | LiteralType | UnionType | ArrayType;

export interface InterfaceDeclaration {
  properties?: {
    [name: string]: TypeInfo;
  };
  index?: TypeInfo;
}

export interface EnumDeclaration {
  enum: {
    [name: string]: string | number;
  };
}

export interface ImportDeclaration {
  import: string;
}

export interface Module {
  members: {
    [name: string]: ImportDeclaration | InterfaceDeclaration | EnumDeclaration | TypeInfo;
  };
}

export interface MetaInfo {
  modules: Module[];
  hasErrors: boolean;
}
