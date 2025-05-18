"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restToNormalized = exports.soapToNormalized = void 0;
var soapToNormalized_1 = require("./converters/soapToNormalized");
Object.defineProperty(exports, "soapToNormalized", { enumerable: true, get: function () { return soapToNormalized_1.soapToNormalized; } });
var restToNormalized_1 = require("./converters/restToNormalized");
Object.defineProperty(exports, "restToNormalized", { enumerable: true, get: function () { return restToNormalized_1.restToNormalized; } });
