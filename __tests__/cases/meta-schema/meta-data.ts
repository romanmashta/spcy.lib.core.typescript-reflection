import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    TypeInfo: {
      oneOf: [
        {
          $ref: '#/$defs/ObjectType'
        },
        {
          $ref: '#/$defs/SimpleType'
        },
        {
          $ref: '#/$defs/ArrayType'
        },
        {
          $ref: '#/$defs/TypeReference'
        },
        {
          $ref: '#/$defs/EnumType'
        },
        {
          $ref: '#/$defs/ConstLiteral'
        },
        {
          $ref: '#/$defs/OneOf'
        },
        {
          $ref: '#/$defs/AllOf'
        }
      ]
    },
    TypeReference: {
      type: 'object',
      properties: {
        $ref: {
          type: 'string'
        }
      }
    },
    ArrayType: {
      type: 'object',
      properties: {
        type: {
          const: 'array'
        },
        items: {
          $ref: '#/$defs/TypeInfo'
        }
      }
    },
    ConstLiteral: {
      type: 'object',
      properties: {
        const: {
          oneOf: [
            {
              type: 'string'
            },
            {
              type: 'number'
            },
            {
              type: 'boolean'
            },
            {
              type: 'null'
            }
          ]
        }
      }
    },
    EnumType: {
      type: 'object',
      properties: {
        enum: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    },
    SimpleType: {
      type: 'object',
      properties: {
        type: {
          oneOf: [
            {
              const: 'string'
            },
            {
              const: 'number'
            },
            {
              const: 'boolean'
            },
            {
              const: 'date'
            },
            {
              const: 'null'
            }
          ]
        }
      }
    },
    ObjectType: {
      type: 'object',
      properties: {
        type: {
          const: 'object'
        },
        properties: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/TypeInfo'
          }
        },
        additionalProperties: {
          oneOf: [
            {
              $ref: '#/$defs/TypeInfo'
            },
            {
              type: 'boolean'
            }
          ]
        }
      }
    },
    OneOf: {
      type: 'object',
      properties: {
        oneOf: {
          type: 'array',
          items: {
            $ref: '#/$defs/TypeInfo'
          }
        }
      }
    },
    AllOf: {
      type: 'object',
      properties: {
        allOf: {
          type: 'array',
          items: {
            $ref: '#/$defs/TypeInfo'
          }
        }
      }
    },
    Module: {
      type: 'object',
      properties: {
        $defs: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/TypeInfo'
          }
        }
      }
    },
    MetaInfo: {
      type: 'object',
      properties: {
        modules: {
          type: 'array',
          items: {
            $ref: '#/$defs/Module'
          }
        },
        hasErrors: {
          type: 'boolean'
        }
      }
    }
  }
};
