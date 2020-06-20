export const ModuleTemplate: string = `import { TypeInfo } from '@spcy/lib.core.reflection';

{{#each module.$defs}}
export const {{@key}}Schema: TypeInfo = {{stringify .}}; 
{{/each}}

`;
