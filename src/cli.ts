#!/usr/bin/env node
// src/cli.ts
import fs   from 'fs';
import path from 'path';

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { soapToNormalized } from './converters/soapToNormalized';
import { restToNormalized } from './converters/restToNormalized';

interface CliArgs {
  soap?: string;
  rest?: string;
  _: (string | number)[];
  $0: string;
}

async function main(): Promise<void> {
  const parser = yargs(hideBin(process.argv))
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
  const argv = (await parser.parseAsync()) as unknown as CliArgs;
  /* --------------------------------------------------------------- */

  if (argv.soap) {
    const xml = fs.readFileSync(path.resolve(argv.soap), 'utf8');
    const out = await soapToNormalized(xml);
    console.log(JSON.stringify(out, null, 2));
    return;
  }

  /* otherwise we have --rest */
  const raw = JSON.parse(
    fs.readFileSync(path.resolve(argv.rest!), 'utf8'),
  );
  const out = restToNormalized(raw);
  console.log(JSON.stringify(out, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
