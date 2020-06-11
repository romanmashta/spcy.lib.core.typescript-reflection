export type BasicTypes = 'boolean' | 'number' | 'string';

export interface TypeReference {
  typeRef: string;
  arguments?: TypeInfo[];
}

export interface TypeLiteral {
  properties: {
    [name: string]: TypeInfo;
  };
}

export type TypeInfo = BasicTypes | TypeReference | TypeLiteral;

export interface InterfaceDeclaration {
  interface: {
    extends?: TypeInfo;
  } & TypeLiteral;
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
