export const ModuleTemplate = `import { TypeInfo, Module } from '@spcy/lib.core.reflection';
{{#each exports}}
import { {{moduleName}}Schema } from '{{fileName}}'
{{/each}}

{{#each module.$defs}}
const {{@key}}: TypeInfo = {{stringify .}};

{{/each}}

export const {{moduleName}}Schema: Module = {
  $id: '{{module.$id}}',
  $defs: {
{{#each module.$defs}}
    {{@key}},
{{/each}}
{{#each exports}}
    ...{{moduleName}}Schema.$defs,
{{/each}}
  }
};

`;
