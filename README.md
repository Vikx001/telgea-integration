#  Telgea MVNO Integration – REST & SOAP Normalizer

This project implements a partial integration layer between an MVNO telecom provider's API (both **REST** and **SOAP**) and Telgea’s internal canonical format.

The goal is to normalize inconsistent upstream payloads into a standard format expected by Telgea. This enables unified data processing, billing, and analytics across heterogeneous sources.

---

##  Objective

> _"Structure and partially implement the integration between the provider’s telecom API and Telgea’s internal API normalizer."_

This repository:
- Parses **REST JSON** and **SOAP XML** payloads.
- Converts each into a common `InternalApiFormat`.
- Supports both command-line and browser-based conversions.
- Includes type-safe code, automated tests, and ESLint/TSConfig rules for development consistency.

---

##  Tech Stack

| Tool            | Purpose                                      |
|-----------------|----------------------------------------------|
| **TypeScript**  | Type safety and clarity in transformation logic |
| **Node.js**     | Execution environment for CLI and web        |
| **Jest**        | Unit testing framework                       |
| **Vite**        | Lightweight dev server for browser UI        |
| **xml2js**      | SOAP XML parsing and tag sanitization        |
| **Yargs**       | Argument parsing for CLI tools               |
| **ESLint**      | Enforces linting rules and clean code        |

---

##  Thought Process & Approach

1. **Payload Analysis**  
   Parsed sample payloads to identify structural mismatches and normalize discrepancies (e.g., `sms_charges`, optional CDATA, wrapped SOAP, extra keys).

2. **Unification Strategy**  
   Defined a consistent `InternalApiFormat` TypeScript interface shared by both converters.

3. **Two-Path Normalization**
   - `restToNormalized`: Handles nested JSON with optional arrays and strict typing.
   - `soapToNormalized`: Handles XML → JS object, prefix stripping, CDATA unwrapping, and single-item collapsing.

4. **Multi-Channel Interface**
   - Built a CLI for automation/scripting.
   - Built a browser UI for manual validation and live conversions.

5. **Test-Driven Coverage**
   - Covered edge cases: missing optional fields, malformed XML, CDATA handling, default fallbacks.

6. **Strict Conventions**
   - Used ESLint and TSConfig rules to maintain formatting, types, and imports.
   - Output is guaranteed to match `InternalApiFormat` regardless of source.

---

##  Folder Structure

```
TELGEA-TEST/
├── dist/
├── node_modules/
├── specs/
│   ├── mvno_rest_spec.json
│   ├── mvno_soap_spec.xml
│   └── expected_*.json
├── src/
│   ├── converters/
│   ├── models/
│   ├── web/
│   ├── cli.ts
│   └── index.ts
├── tests/
├── .eslintrc.json
├── tsconfig.json
├── jest.config.js
├── vite.config.js
├── package.json
└── README.md
```

---

##  Normalization Format (`InternalApiFormat`)

```ts
interface InternalApiFormat {
  telgea_user_id: string;
  msisdn: string;
  usage_data: {
    total_mb: number;
    roaming_mb: number;
    country: string;
    network_type: string;
    provider_code: string;
  };
  sms_charges: SmsCharge[];
  billing_period: {
    start: string;
    end: string;
  };
}
```

---

##  Why It Doesn’t Work on Vercel UI

Vercel only supports **static frontend deployments** by default.  
However, this app's converters (`soapToNormalized` and `restToNormalized`) depend on **Node.js-only modules** like `fs`, which **are not available in the browser**.

###  Result:
- The frontend UI shows up on Vercel.
- But conversions don’t run due to missing Node APIs in the browser.
- This is a technical limitation of serverless/static deployment, not the code.

---


## Usage

### Run Tests

```bash
npm install
npm run test
```

### CLI Usage

```bash
node dist/cli.js --rest specs/mvno_rest_spec.json
node dist/cli.js --soap specs/mvno_soap_spec.xml
```

### Web Demo

```bash
npm run dev
# Visit http://localhost:5173
```

---

## Features

- REST + SOAP format support
- CLI and browser interface
- CDATA + edge handling
- Full test coverage
- Linted and typed

---

## Trade-Offs

| Decision                     | Rationale |
|-----------------------------|-----------|
| xml2js                      | Simple, effective, customizable |
| CLI + Web Interface         | Enables testing and demo |
| Skipped schema enforcement  | TypeScript model is sufficient |
| No persistence              | Focused on transformation only |

---

##  Dev Conventions

- ESLint: Applied via `.eslintrc.json`
- Jest: All tests under `/tests`
- TS: Interfaces and strict null checks

---

## Final Note

While the UI is deployable, full functionality **only works locally** due to Node-only transformation logic.

If full online support is needed, the logic would need to be migrated to browser-safe code or moved into serverless API routes.

---

##  Feedback

Fork and PRs welcome!

**Author:** [Vikash Sharma](https://github.com/Vikx001)  
**License:** MIT
