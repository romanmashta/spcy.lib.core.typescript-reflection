import { property } from '@spcy/lib.core.reflection';

export interface Person {
  email: property<string, { pattern: '.*' }>;
  age: property<number, { minimum: 1; maximum: 99 }>;
  name: property<string>;
}
