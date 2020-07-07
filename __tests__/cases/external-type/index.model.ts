import { TypeInfo } from '@spcy/lib.core.reflection';
import { Tag } from './tag.model';

export interface Decorator {
  title: string;
  tags: Tag[];
  type: TypeInfo;
}
