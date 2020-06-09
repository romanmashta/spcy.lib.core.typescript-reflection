export type BasicTypes = 'boolean' | 'number' | 'string';

interface TypeReference {
  typeRef: string;
  arguments?: TypeInfo[];
}

type TypeInfo = BasicTypes | TypeReference;

interface InterfaceDeclaration {
  interface: {
    extends?: TypeInfo;
    properties: {
      [name: string]: TypeInfo;
    };
  };
}

interface EnumDeclaration {
  enum: {
    [name: string]: string | number;
  };
}

interface ImportDeclaration {
  import: string;
}

export interface Module {
  [name: string]: ImportDeclaration | InterfaceDeclaration | EnumDeclaration;
}
