export interface ExtraInfo {
  required?: boolean;
  count?: number;
  description?: string;
  some?: string;
}

export type Property<T, E extends ExtraInfo = {}> = T;
