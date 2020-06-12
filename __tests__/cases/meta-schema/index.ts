export type BasicTypes = 'boolean' | 'number' | 'string';
export type LiteralType = string | number | boolean | null;

export interface TypeReference {
  typeRef: string;
  arguments?: TypeInfo[];
}

export interface TypeLiteral {
  properties: {
    [name: string]: TypeInfo;
  };
}

export interface UnionType {
  anyOf: TypeInfo[];
}

export type TypeInfo = BasicTypes | TypeReference | TypeLiteral | LiteralType | UnionType;

export interface InterfaceDeclaration {
  properties: {
    [name: string]: TypeInfo;
  };
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
