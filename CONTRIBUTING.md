# Contributing

SCN's public repository is a research demonstrator. Contributions must use synthetic data and must not add private economics, collateral formulas, production topology, secrets, counterparty data, legal work product, or claims of regulatory or Sharia approval.

## Local check

1. Serve `demo/` over HTTP.
2. Run `node --check demo/app.js`.
3. Confirm the JSON files parse and the public/private boundary remains intact.
4. Exercise the registry, stress scenarios, governance view, and settlement simulator.

Critical financial logic belongs behind independent review and is outside this public prototype.
