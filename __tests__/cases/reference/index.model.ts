import { ReferenceWithType } from '@spcy/lib.core.reflection';

export interface Query {
  name: string;
}

export interface QueryView {
  viewName: string;
  query: ReferenceWithType<Query>;
}
