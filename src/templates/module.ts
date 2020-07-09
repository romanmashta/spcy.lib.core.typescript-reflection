export const ModuleTemplate = `
import * as r from '@spcy/lib.core.reflection';
{{#if isEmpty}}
{{else}}
import * as m from './{{moduleFileName}}';
{{/if}}
{{#each exports}}
import { {{importName}}Module as {{aliasName}}Module, Types as {{aliasName}}Types } from '{{fileName}}';
{{/each}}

{{#each module.$defs}}
const {{@key}}Type: r.TypeInfo = {{stringify .}};

{{#if $typeArguments}}
const {{@key}}: r.PrototypeInfo = { 
  $ref: {{@key}}Type.$id!,
  $refPackage: {{@key}}Type.$package!,
  typeInfo: {{@key}}Type,
}
{{else}}
const {{@key}}: r.Prototype<m.{{@key}}> = { 
  $ref: {{@key}}Type.$id!,
  $refPackage: {{@key}}Type.$package!,
  typeInfo: {{@key}}Type,
}
{{/if}}

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

export const Types = {
{{#each module.$defs}}
    {{@key}},
{{/each}}
{{#each exports}}
    ...{{aliasName}}Types,
{{/each}}
};
`;
