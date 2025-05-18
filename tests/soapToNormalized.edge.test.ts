import { readFileSync } from 'fs';
import { join }         from 'path';
import { soapToNormalized } from '../src/converters/soapToNormalized';
import expected from '../specs/expected_edge_soap.json';

test('SOAP handles comment wrappers & extra fields', async () => {
  const xml = readFileSync(
    join(__dirname, '../specs/edge_soap_spec.xml'),
    'utf8'
  );
  const out = await soapToNormalized(xml);
  expect(out).toEqual(expected);
});
