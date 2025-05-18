import { readFileSync } from 'fs';
import { join }         from 'path';
import { restToNormalized } from '../src/converters/restToNormalized';

test('REST maps sms_charges array correctly', () => {
  const raw = JSON.parse(
    readFileSync(join(__dirname, '../specs/edge_rest_spec.json'), 'utf8')
  );
  const out = restToNormalized(raw);

  expect(out.sms_charges).toEqual([
    {
      message_id: 'm1',
      timestamp:  '2025-01-15T12:00:00Z',
      amount:      0.02,
      currency:   'USD'
    },
    {
      message_id: 'm2',
      timestamp:  '2025-01-20T18:30:00Z',
      amount:      0.05,
      currency:   'USD'
    }
  ]);

  // And everything else stays mapping correctly:
  expect(out.telgea_user_id).toBe('edge123');
  expect(out.usage_data.total_mb).toBe(500.5);
});
