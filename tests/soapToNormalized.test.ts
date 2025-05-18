// tests/soapToNormalized.test.ts
import { readFileSync } from 'fs';
import { join } from 'path';
import { soapToNormalized } from '../src/converters/soapToNormalized';
import expected from '../specs/expected_soap.json';

test('SOAP maps to Telgea format', async () => {
  const xml = readFileSync(                 // verify the relative path
    join(__dirname, '../specs/mvno_soap_spec.xml'),
    'utf8'
  );
  expect(await soapToNormalized(xml)).toEqual(expected);
});
