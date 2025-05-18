// src/converters/soapToNormalized.ts

import { parseStringPromise, processors } from 'xml2js';
import { InternalApiFormat }              from '../models/internalApiFormat';

const { stripPrefix } = processors;

/**
 * Convert the MVNO’s ChargeSMS SOAP payload → Telgea internal API format.
 *  • Strips ALL namespace prefixes (so you get Envelope.Body.ChargeSMS)
 *  • Collapses single-element arrays
 *  • Unwraps a top‐level comment wrapper (<!-- … -->) if present
 */
export async function soapToNormalized(xml: string): Promise<InternalApiFormat> {
  // 1) If the entire envelope is wrapped in one big comment, just remove the markers
  //    but keep the contents:
  const uncommented = xml
    .replace(/^\s*<!--\s*/, '')   // remove leading <!--
    .replace(/\s*-->\s*$/, '')    // remove trailing -->
    .trim();

  // 2) Parse + strip all prefixes
  const doc = await parseStringPromise(uncommented, {
    explicitArray:     false,
    tagNameProcessors: [stripPrefix],
  });

  // 3) Sanity-check that we got an object
  if (!doc || typeof doc !== 'object') {
    throw new Error('Failed to parse SOAP XML');
  }

  // 4) Find whichever top-level key holds Body.ChargeSMS
  const envelope = Object.values(doc as Record<string, any>)
    .find(node =>
      node &&
      typeof node === 'object' &&
      'Body' in node &&
      node.Body != null &&
      'ChargeSMS' in node.Body
    );

  if (!envelope) {
    throw new Error('SOAP payload missing Envelope/Body/ChargeSMS');
  }

  const sms = envelope.Body.ChargeSMS;

  return {
    telgea_user_id: sms.UserID,
    msisdn:         sms.PhoneNumber,

    usage_data: {
      total_mb:      0,
      roaming_mb:    0,
      country:       '',
      network_type:  '',
      provider_code: ''
    },

    sms_charges: [{
      message_id: sms.MessageID,
      timestamp:  sms.Timestamp,
      amount:     Number(sms.ChargeAmount),
      currency:   sms.Currency
    }],

    billing_period: {
      start: sms.Timestamp,
      end:   sms.Timestamp
    }
  };
}