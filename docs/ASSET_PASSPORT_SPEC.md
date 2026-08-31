# Asset Passport — Public Specification

The public schema intentionally omits proprietary scoring and eligibility formulas.

## Required domains

- canonical asset identity;
- issuer / obligor;
- beneficial owner or controlling account;
- custodian;
- jurisdiction;
- asset class;
- source evidence references;
- valuation-source references;
- encumbrance summary;
- policy-review summary;
- insurance / protection metadata where relevant;
- timestamps and version;
- status.

## Policy attestations

A policy attestation never means universal approval.

Each attestation must identify:
- reviewing authority;
- scope;
- document/version;
- applicable product;
- applicable jurisdiction;
- issue date;
- review/expiry date if applicable;
- exceptions;
- evidence reference.

For Sharia governance, the system records the review; it does not invent or issue a fatwa.
