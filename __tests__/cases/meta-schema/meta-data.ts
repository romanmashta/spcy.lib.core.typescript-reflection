import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  members: {
    BasicTypes: {
      anyOf: ['boolean', 'number', 'string']
    },
    LiteralType: {
      anyOf: ['string', 'number', 'boolean', null]
    },
    TypeReference: {
      properties: {
        typeRef: 'string',
        arguments: {
          array: {
            typeRef: 'TypeInfo'
          }
        }
      }
    },
    TypeLiteral: {
      properties: {
        properties: {
          index: {
            typeRef: 'TypeInfo'
          }
        },
        index: {
          typeRef: 'TypeInfo'
        }
      }
    },
    UnionType: {
      properties: {
        anyOf: {
          array: {
            typeRef: 'TypeInfo'
          }
        }
      }
    },
    ArrayType: {
      properties: {
        array: {
          typeRef: 'TypeInfo'
        }
      }
    },
    TypeInfo: {
      anyOf: [
        {
          typeRef: 'BasicTypes'
        },
        {
          typeRef: 'TypeReference'
        },
        {
          typeRef: 'TypeLiteral'
        },
        {
          typeRef: 'LiteralType'
        },
        {
          typeRef: 'UnionType'
        },
        {
          typeRef: 'ArrayType'
        }
      ]
    },
    InterfaceDeclaration: {
      properties: {
        properties: {
          index: {
            typeRef: 'TypeInfo'
          }
        },
        index: {
          typeRef: 'TypeInfo'
        }
      }
    },
    EnumDeclaration: {
      properties: {
        enum: {
          index: {
            anyOf: ['string', 'number']
          }
        }
      }
    },
    ImportDeclaration: {
      properties: {
        import: 'string'
      }
    },
    Module: {
      properties: {
        members: {
          index: {
            anyOf: [
              {
                typeRef: 'ImportDeclaration'
              },
              {
                typeRef: 'InterfaceDeclaration'
              },
              {
                typeRef: 'EnumDeclaration'
              },
              {
                typeRef: 'TypeInfo'
              }
            ]
          }
        }
      }
    },
    MetaInfo: {
      properties: {
        modules: {
          array: {
            typeRef: 'Module'
          }
        },
        hasErrors: 'boolean'
      }
    }
  }
};
