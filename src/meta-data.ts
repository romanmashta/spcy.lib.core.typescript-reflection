export type BasicTypes = 'boolean' | 'number' | 'string';
export type LiterlType = string | number | boolean | null;

export interface TypeReference {
  typeRef: string;
  arguments?: TypeInfo[];
}

export interface TypeLiteral {
  properties: {
    [name: string]: TypeInfo;
  };
}

export type TypeInfo = BasicTypes | TypeReference | TypeLiteral | LiterlType;

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
    [name: string]: ImportDeclaration | InterfaceDeclaration | EnumDeclaration;
  };
}

export interface MetaInfo {
  modules: Module[];
  hasErrors: boolean;
}
