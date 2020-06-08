import { sayHi, sayBye } from '../src';

test('It says Hi', () => {
  expect(sayHi('Me')).toBe('Hi Me');
});

test('It says Bye', () => {
  expect(sayBye('Me')).toBe('Bye Me');
});
