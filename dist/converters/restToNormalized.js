"use strict";
// src/converters/restToNormalized.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.restToNormalized = restToNormalized;
function restToNormalized(payload) {
    var _a;
    return {
        telgea_user_id: payload.user_id,
        msisdn: payload.msisdn,
        usage_data: {
            total_mb: payload.usage.data.total_mb,
            roaming_mb: payload.usage.data.roaming_mb,
            country: payload.usage.data.country,
            network_type: payload.network.type,
            provider_code: payload.network.provider_code,
        },
        sms_charges: ((_a = payload.sms_charges) !== null && _a !== void 0 ? _a : []).map(s => ({
            message_id: s.message_id,
            timestamp: s.timestamp,
            amount: s.amount,
            currency: s.currency,
        })),
        billing_period: {
            start: payload.usage.period.start,
            end: payload.usage.period.end,
        },
    };
}
