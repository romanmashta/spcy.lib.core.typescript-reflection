export const ModuleTemplate = `import * as r from '@spcy/lib.core.reflection';
{{#if isEmpty}}
{{else}}
import * as m from './{{moduleFileName}}';
{{/if}}
{{#each exports}}
import { {{importName}}Module as {{aliasName}}Module } from '{{fileName}}';
{{/each}}

{{#each module.$defs}}
export const {{@key}}Type: r.TypeInfo & r.Prototype<m.{{@key}}> = {{stringify .}};

{{/each}}

export const {{moduleName}}Module: r.Module = {
  $id: '{{module.$id}}',
  $defs: {
{{#each module.$defs}}
    {{@key}}: {{@key}}Type,
{{/each}}
{{#each exports}}
    ...{{aliasName}}Module.$defs,
{{/each}}
  }
};

`;
