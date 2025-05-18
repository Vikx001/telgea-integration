/**
 * Canonical record Telgea expects.
 */
export interface InternalApiFormat {
  telgea_user_id: string;
  msisdn:         string;

  usage_data: {
    total_mb:      number;
    roaming_mb:    number;
    country:       string;
    network_type:  string;
    provider_code: string;
  };

  sms_charges: SmsCharge[];

  billing_period: {
    start: string; // ISO-8601 timestamp
    end:   string;
  };
}

/** Details for a single SMS charge event. */
export interface SmsCharge {
  message_id: string;
  timestamp:  string; // ISO-8601 timestamp
  amount:     number;
  currency:   string;
  extra_info?: string; // optional field, if present in payload
}
