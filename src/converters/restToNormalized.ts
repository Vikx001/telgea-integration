// src/converters/restToNormalized.ts

import { InternalApiFormat, SmsCharge } from '../models/internalApiFormat';

interface RestPayload {
  user_id:     string;
  msisdn:      string;
  usage: {
    data:   { total_mb: number; roaming_mb: number; country: string };
    period: { start: string;       end: string   };
  };
  network:      { type: string; provider_code: string };
  sms_charges?: Array<{
    message_id: string;
    timestamp:  string;
    amount:     number;
    currency:   string;
    // you can carry through any extra fields if you like:
    [key: string]: any;
  }>;
}

export function restToNormalized(payload: RestPayload): InternalApiFormat {
  return {
    telgea_user_id: payload.user_id,
    msisdn:         payload.msisdn,

    usage_data: {
      total_mb:      payload.usage.data.total_mb,
      roaming_mb:    payload.usage.data.roaming_mb,
      country:       payload.usage.data.country,
      network_type:  payload.network.type,
      provider_code: payload.network.provider_code,
    },

    sms_charges: (payload.sms_charges ?? []).map< SmsCharge >(s => ({
      message_id: s.message_id,
      timestamp:  s.timestamp,
      amount:     s.amount,
      currency:   s.currency,
    })),

    billing_period: {
      start: payload.usage.period.start,
      end:   payload.usage.period.end,
    },
  };
}
