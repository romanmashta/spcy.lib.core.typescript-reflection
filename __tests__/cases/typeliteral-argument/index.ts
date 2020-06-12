import { Property } from '../utils';

export interface Person {
  firstName: Property<string, { required: true; count: 10; description: 'First Name'; some: null }>;
  lastName: Property<string, { required: true; description: 'Last Name' }>;
  location: Property<
    {
      lat: number;
      lon: number;
    },
    { required: true; description: 'User location' }
  >;
}
