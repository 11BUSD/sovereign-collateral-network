# Threat Model — Public

## Primary failure classes

| Risk | Public control concept |
|---|---|
| Liquidity illusion | executable-depth / capacity review |
| Oracle manipulation | multiple sources + circuit breakers |
| Wrong-way collateral | related-party and self-issued-asset limits |
| Liquidation cascade | concentration limits + stress simulation |
| Stable settlement depeg | reserve / issuer diversification and explicit depeg state |
| Rehypothecation opacity | encumbrance ledger |
| Governance capture | concentration analytics + protected controls |
| Admin-key compromise | multisig + timelock + separated roles |
| Reserve fraud | attestations, reconciliation, auditability |
| Policy drift | versioned policy + scoped attestations |
| Smart-contract exploit | staged deployment, independent audits, bounded upgrade authority |
| Counterparty default | exposure caps + legal/custody state |
| Circular tokenomics | realized external cash-flow separation |
| Regulatory perimeter breach | jurisdiction/product gate |

## Security rule

The public prototype must never contain:
- private keys;
- production RPC credentials;
- real client data;
- live treasury functions;
- unaudited autonomous transaction execution.
