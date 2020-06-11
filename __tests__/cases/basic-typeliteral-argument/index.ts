export interface ExtraInfo {
  required?: boolean;
  description?: string;
}

type Property<T, E extends ExtraInfo = {}> = T;

export interface Person {
  firstName: Property<string, { required: true; description: 'First Name' }>;
  lastName: Property<string, { required: true; description: 'Last Name' }>;
}
