export const ModuleTemplate = `;{{#if isEmpty}}
import { Module } from '@spcy/lib.core.reflection'
{{else}}
import { TypeInfo, Module } from '@spcy/lib.core.reflection'
{{/if}}
{{#each exports}}
import { {{importName}}Module as {{aliasName}}Module } from '{{fileName}}'
{{/each}}

{{#each module.$defs}}
const {{@key}}: TypeInfo = {{stringify .}};

{{/each}}

export const {{moduleName}}Module: Module = {
  $id: '{{module.$id}}',
  $defs: {
{{#each module.$defs}}
    {{@key}},
{{/each}}
{{#each exports}}
    ...{{aliasName}}Module.$defs,
{{/each}}
  }
};

`;
