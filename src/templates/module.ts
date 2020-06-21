export const ModuleTemplate = `import { TypeInfo, Module, SchemaRepository } from '@spcy/lib.core.reflection';

{{#each module.$defs}}
export const {{@key}}Schema: TypeInfo = {{stringify .}};
SchemaRepository.register({{@key}}Schema);

{{/each}}

export const MetaSchema: Module = {
  $defs: {
{{#each module.$defs}}
    {{@key}}: {{@key}}Schema,
{{/each}}  
  }
};

`;
