export const ModuleTemplate = `import { TypeInfo, Module{{#if useRegistration}}, SchemaRepository{{/if}} } from '@spcy/lib.core.reflection';

{{#each module.$defs}}
export const {{@key}}Schema: TypeInfo = {{stringify .}};

{{#if useRegistration}}
SchemaRepository.register({{@key}}Schema);
{{/if}}

{{/each}}

export const MetaSchema: Module = {
  $defs: {
{{#each module.$defs}}
    {{@key}}: {{@key}}Schema,
{{/each}}  
  }
};

`;
