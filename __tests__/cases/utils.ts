export interface ExtraInfo {
  required?: boolean;
  count?: number;
  description?: string;
  some?: string;
}

export type Property<type, extra extends ExtraInfo = {}> = type;
