#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/cli.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs/yargs"));
const helpers_1 = require("yargs/helpers");
const soapToNormalized_1 = require("./converters/soapToNormalized");
const restToNormalized_1 = require("./converters/restToNormalized");
async function main() {
    const parser = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
        .scriptName('telgea')
        .usage('Usage: $0 --soap <file.xml> | --rest <file.json>')
        .option('soap', { type: 'string', describe: 'Path to a SOAP XML file' })
        .option('rest', { type: 'string', describe: 'Path to a REST JSON file' })
        .check(a => {
        const soap = !!a.soap;
        const rest = !!a.rest;
        if (soap === rest) {
            throw new Error('Supply **exactly one** of --soap or --rest');
        }
        return true;
    });
    /* ---------------------------------------------------------------
       parseAsync isn’t generic in this typings version, so cast:     */
    const argv = (await parser.parseAsync());
    /* --------------------------------------------------------------- */
    if (argv.soap) {
        const xml = fs_1.default.readFileSync(path_1.default.resolve(argv.soap), 'utf8');
        const out = await (0, soapToNormalized_1.soapToNormalized)(xml);
        console.log(JSON.stringify(out, null, 2));
        return;
    }
    /* otherwise we have --rest */
    const raw = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(argv.rest), 'utf8'));
    const out = (0, restToNormalized_1.restToNormalized)(raw);
    console.log(JSON.stringify(out, null, 2));
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
