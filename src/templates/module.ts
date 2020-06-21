export const ModuleTemplate = `import { TypeInfo, Module } from '@spcy/lib.core.reflection';

{{#each module.$defs}}
export const {{@key}}Schema: TypeInfo = {{stringify .}};

{{/each}}

export const MetaSchema: Module = {
  $defs: {
{{#each module.$defs}}
    {{@key}}: {{@key}}Schema,
{{/each}}  
  }
};

`;
