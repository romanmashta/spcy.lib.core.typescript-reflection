import { Module } from '@spcy/lib.core.reflection';

export const meta: Module = {
  $defs: {
    TypeInfo: {
      oneOf: [
        {
          $ref: '#/$defs/ObjectType'
        },
        {
          $ref: '#/$defs/StringType'
        },
        {
          $ref: '#/$defs/BooleanType'
        },
        {
          $ref: '#/$defs/NumberType'
        },
        {
          $ref: '#/$defs/DateType'
        },
        {
          $ref: '#/$defs/NullType'
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
      required: ['$ref'],
      properties: {
        $ref: {
          type: 'string'
        }
      }
    },
    ArrayType: {
      type: 'object',
      required: ['type', 'items'],
      properties: {
        type: {
          const: 'array'
        },
        items: {
          $ref: '#/$defs/TypeInfo'
        },
        minItems: {
          type: 'number'
        },
        maxItems: {
          type: 'number'
        },
        uniqueItems: {
          type: 'boolean'
        }
      }
    },
    ConstLiteral: {
      type: 'object',
      required: ['const'],
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
      required: ['enum'],
      properties: {
        enum: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    },
    NullType: {
      type: 'object',
      required: ['type'],
      properties: {
        type: {
          const: 'null'
        }
      }
    },
    DateType: {
      type: 'object',
      required: ['type'],
      properties: {
        type: {
          const: 'date'
        }
      }
    },
    BooleanType: {
      type: 'object',
      required: ['type'],
      properties: {
        type: {
          const: 'boolean'
        }
      }
    },
    StringType: {
      type: 'object',
      required: ['type'],
      properties: {
        type: {
          const: 'string'
        },
        minLength: {
          type: 'number'
        },
        maxLength: {
          type: 'number'
        },
        pattern: {
          type: 'string'
        }
      }
    },
    NumberType: {
      type: 'object',
      required: ['type'],
      properties: {
        type: {
          const: 'number'
        },
        minimum: {
          type: 'number'
        },
        maximum: {
          type: 'number'
        }
      }
    },
    ObjectType: {
      type: 'object',
      required: ['type'],
      properties: {
        type: {
          const: 'object'
        },
        required: {
          type: 'array',
          items: {
            type: 'string'
          }
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
      required: ['oneOf'],
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
      required: ['allOf'],
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
      required: ['$defs'],
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
      required: ['modules', 'hasErrors'],
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
