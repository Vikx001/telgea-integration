"use strict";
// src/converters/soapToNormalized.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.soapToNormalized = soapToNormalized;
const xml2js_1 = require("xml2js");
const { stripPrefix } = xml2js_1.processors;
/**
 * Convert the MVNO’s ChargeSMS SOAP payload → Telgea internal API format.
 *  • Strips ALL namespace prefixes (so you get Envelope.Body.ChargeSMS)
 *  • Collapses single-element arrays
 *  • Unwraps a top‐level comment wrapper (<!-- … -->) if present
 */
async function soapToNormalized(xml) {
    // 1) If the entire envelope is wrapped in one big comment, just remove the markers
    //    but keep the contents:
    const uncommented = xml
        .replace(/^\s*<!--\s*/, '') // remove leading <!--
        .replace(/\s*-->\s*$/, '') // remove trailing -->
        .trim();
    // 2) Parse + strip all prefixes
    const doc = await (0, xml2js_1.parseStringPromise)(uncommented, {
        explicitArray: false,
        tagNameProcessors: [stripPrefix],
    });
    // 3) Sanity-check that we got an object
    if (!doc || typeof doc !== 'object') {
        throw new Error('Failed to parse SOAP XML');
    }
    // 4) Find whichever top-level key holds Body.ChargeSMS
    const envelope = Object.values(doc)
        .find(node => node &&
        typeof node === 'object' &&
        'Body' in node &&
        node.Body != null &&
        'ChargeSMS' in node.Body);
    if (!envelope) {
        throw new Error('SOAP payload missing Envelope/Body/ChargeSMS');
    }
    const sms = envelope.Body.ChargeSMS;
    return {
        telgea_user_id: sms.UserID,
        msisdn: sms.PhoneNumber,
        usage_data: {
            total_mb: 0,
            roaming_mb: 0,
            country: '',
            network_type: '',
            provider_code: ''
        },
        sms_charges: [{
                message_id: sms.MessageID,
                timestamp: sms.Timestamp,
                amount: Number(sms.ChargeAmount),
                currency: sms.Currency
            }],
        billing_period: {
            start: sms.Timestamp,
            end: sms.Timestamp
        }
    };
}
