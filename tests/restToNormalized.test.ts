// tests/restToNormalized.test.ts
import { readFileSync } from 'fs';
import { join } from 'path';
import { restToNormalized } from '../src/converters/restToNormalized';
import expected from '../specs/expected_rest.json';

test('REST maps to Telgea format', () => {
  const json = JSON.parse(readFileSync(join(__dirname, '../specs/mvno_rest_spec.json'), 'utf8'));
  expect(restToNormalized(json)).toEqual(expected);
});
