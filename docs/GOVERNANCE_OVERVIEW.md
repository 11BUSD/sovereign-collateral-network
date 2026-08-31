# Governance Overview

Governance is a first-class product surface, not a token-holder afterthought.

## Constitutional layers

### Layer A — Protocol Constitution
Hard boundaries that normal governance cannot override:
- no unilateral seizure of client assets;
- no concealed minting;
- no undisclosed reserve substitution;
- no retroactive alteration of executed ledger history;
- no self-issued volatile token as core collateral;
- no bypass of required legal / compliance / Sharia review gates;
- no single signer can move treasury or change critical risk parameters.

### Layer B — Risk Policy
Controls collateral eligibility, concentration, liquidity and counterparty exposure.

### Layer C — Product Policy
Controls supported assets, integrations, settlement rails and jurisdictions.

### Layer D — Emergency Authority
Narrowly scoped pause powers for defined incidents.

## Proposed institutional governance bodies

1. **Board / Governing Council**
2. **Risk Committee**
3. **Technical Security Committee**
4. **Treasury / Asset-Liability Committee**
5. **Compliance & Regulatory Committee**
6. **Sharia Supervisory function** when a specific product is marketed or operated under Sharia governance
7. **Independent audit / assurance function**

## Proposal lifecycle

```text
DRAFT
 -> EVIDENCE_REVIEW
 -> RISK_REVIEW
 -> LEGAL/REGULATORY_REVIEW (if triggered)
 -> SHARIA_REVIEW (if triggered)
 -> APPROVED
 -> TIMELOCKED
 -> EXECUTABLE
 -> EXECUTED
 -> POST_IMPLEMENTATION_REVIEW
```

Any failed mandatory gate moves the proposal to `BLOCKED`.

## Critical-change examples

Critical changes require enhanced approval:
- reserve asset policy;
- collateral eligibility;
- oracle sources;
- liquidation logic;
- mint/redeem authority;
- upgrade authority;
- treasury transfer authority;
- emergency powers;
- fee recipients;
- new jurisdiction;
- new regulated product;
- changes affecting a Sharia-reviewed product.

## Governance metrics

The production system should continuously expose:
- signer concentration;
- delegated voting concentration;
- effective veto power;
- quorum;
- timelock duration;
- emergency-authority scope;
- unresolved conflicts of interest;
- proposals awaiting independent review.
