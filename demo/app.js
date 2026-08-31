const state = { assets: [], scenario: "base", filter: "All", search: "" };
const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n),
  pct = (n) => `${Math.round(n * 100)}%`;
const esc = (s) =>
  String(s).replace(
    /[&<>'"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        c
      ],
  );
const scenarios = {
  base: {
    name: "Base case",
    losses: {},
    liquidity: 1,
    controls: [
      "Normal monitoring remains active.",
      "Evidence review dates remain enforced.",
      "No transaction execution is enabled.",
    ],
  },
  btc: {
    name: "BTC −60%",
    losses: { "Digital Asset": 0.6 },
    liquidity: 0.72,
    controls: [
      "Freeze new BTC-backed capacity.",
      "Re-run custody and concentration review.",
      "Simulate orderly liquidation capacity.",
    ],
  },
  settlement: {
    name: "Settlement −20%",
    losses: { Cash: 0.2 },
    liquidity: 0.63,
    controls: [
      "Pause synthetic mint pathway.",
      "Reconcile reserve evidence.",
      "Escalate to Treasury and Risk committees.",
    ],
  },
  liquidity: {
    name: "Market depth −50%",
    losses: {
      Sukuk: 0.1,
      "Digital Asset": 0.18,
      "Tokenized Security": 0.08,
      Commodity: 0.06,
      "Trade Finance": 0.14,
      Receivable: 0.14,
    },
    liquidity: 0.5,
    controls: [
      "Reduce candidate financing routes.",
      "Tighten all concentration limits.",
      "Prohibit recursive position expansion.",
    ],
  },
  custody: {
    name: "Custodian outage",
    losses: {
      "Digital Asset": 0.12,
      "Tokenized Security": 0.08,
      Commodity: 0.08,
    },
    liquidity: 0.38,
    controls: [
      "Isolate affected custody dependencies.",
      "Move impacted passports to restricted review.",
      "Begin evidence and control reconciliation.",
    ],
  },
};
const proposals = [
  {
    id: "SCN-GOV-014",
    title: "Add synthetic gold eligibility policy",
    risk: "HIGH",
    state: "RISK_REVIEW",
    reviews: ["Risk", "Legal", "Product"],
    age: "2d",
  },
  {
    id: "SCN-GOV-013",
    title: "Update evidence expiry window",
    risk: "MEDIUM",
    state: "TIMELOCKED",
    reviews: ["Risk", "Compliance"],
    age: "5d",
  },
  {
    id: "SCN-GOV-012",
    title: "Restrict settlement concentration",
    risk: "CRITICAL",
    state: "LEGAL_REVIEW",
    reviews: ["Risk", "Legal", "Treasury", "Security"],
    age: "7d",
  },
];
const totals = (scenario = "base") =>
  state.assets.reduce(
    (t, a) => {
      const loss = scenarios[scenario].losses[a.class] || 0,
        stressed = a.gross * (1 - loss);
      t.gross += a.gross;
      t.enc += a.encumbered;
      t.available += Math.max(0, stressed - a.encumbered);
      t.stressed += stressed;
      return t;
    },
    { gross: 0, enc: 0, available: 0, stressed: 0 },
  );
const metric = (label, value, delta, kind = "") =>
  `<article class="metric"><small>${label}</small><strong>${value}</strong><span class="metricNote ${kind}">${delta}</span></article>`;
function pill(status) {
  const key =
    status.includes("ELIGIBLE") || status === "VERIFIED_RECORD"
      ? "eligible"
      : status === "RESTRICTED"
        ? "restricted"
        : "review";
  return `<span class="pill ${key}">${status.replaceAll("_", " ")}</span>`;
}
function assetRow(a, compact = false) {
  const available = a.gross - a.encumbered;
  return `<button class="assetRow assetGrid" data-asset="${esc(a.id)}"><span class="assetName"><i class="assetIcon">${esc(a.class[0])}</i><span><b>${esc(a.name)}</b><small>${esc(a.id)} · ${esc(a.jurisdiction)}</small></span></span><span><b>${fmt(a.gross)}</b><small>100% gross</small></span><span><b>${fmt(a.encumbered)}</b><small>${pct(a.encumbered / a.gross)} utilized</small></span><span class="${compact ? "hideCompact" : ""}"><b>${fmt(available)}</b><small>${pct(available / a.gross)} free</small></span><span>${pill(a.status)}<small>${esc(a.policy)}</small></span></button>`;
}
function renderOverview() {
  const t = totals(),
    groups = Object.values(
      state.assets.reduce((o, a) => {
        o[a.class] ??= { name: a.class, value: 0 };
        o[a.class].value += a.gross;
        return o;
      }, {}),
    ).sort((a, b) => b.value - a.value),
    colors = [
      "#66d9bd",
      "#7e9cff",
      "#d9bc70",
      "#bf8cff",
      "#fa8b8b",
      "#62b4db",
      "#9ca9bc",
    ];
  document.querySelector("#metrics").innerHTML = [
    metric("Gross recorded value", fmt(t.gross), `Across ${state.assets.length} passports`),
    metric(
      "Encumbered value",
      fmt(t.enc),
      pct(t.enc / t.gross) + " of gross",
      "warn",
    ),
    metric(
      "Potentially available",
      fmt(t.available),
      "Before policy haircuts",
      "good",
    ),
    metric("Evidence coverage", "94.2%", "3 reviews pending", "good"),
  ].join("");
  document.querySelector("#composition").innerHTML =
    `<div class="stackedBar">${groups.map((g, i) => `<i style="width:${(g.value / t.gross) * 100}%;background:${colors[i]}"></i>`).join("")}</div><div class="legend">${groups.map((g, i) => `<div><i style="background:${colors[i]}"></i><span>${esc(g.name)}</span><b>${fmt(g.value)}</b></div>`).join("")}</div>`;
  const ratio = t.available / t.gross;
  document.querySelector("#capacityRing").innerHTML =
    `<div class="ring" style="--value:${ratio * 360}deg"><span><b>${pct(ratio)}</b><small>unencumbered</small></span></div><div class="ringStats"><div><span>Available</span><b>${fmt(t.available)}</b></div><div><span>Encumbered</span><b>${fmt(t.enc)}</b></div></div>`;
  document.querySelector("#assetPreview").innerHTML = state.assets
    .slice(0, 4)
    .map((a) => assetRow(a, true))
    .join("");
  const nodes = ["Custody", "Evidence", "Oracle", "Policy", "Settlement"];
  document.querySelector("#riskGraph").innerHTML =
    `<div class="graphCore">SCN<small>registry</small></div>${nodes.map((n, i) => `<div class="graphNode n${i}">${n}<small>${i === 2 ? "2 providers" : "verified"}</small></div>`).join("")}`;
  document.querySelector("#proposalCount").textContent =
    `${proposals.length} OPEN`;
  document.querySelector("#govPreview").innerHTML = proposals
    .map(
      (p) =>
        `<div class="proposalMini"><span><b>${esc(p.title)}</b><small>${p.id} · ${p.age}</small></span><span class="pill ${p.risk === "CRITICAL" ? "restricted" : "review"}">${p.state.replaceAll("_", " ")}</span></div>`,
    )
    .join("");
}
function renderRegistry() {
  const classes = ["All", ...new Set(state.assets.map((a) => a.class))];
  document.querySelector("#assetFilters").innerHTML = classes
    .map(
      (c) =>
        `<button class="filter ${state.filter === c ? "active" : ""}" data-filter="${esc(c)}">${esc(c)}</button>`,
    )
    .join("");
  const q = state.search.toLowerCase(),
    shown = state.assets.filter(
      (a) =>
        (state.filter === "All" || a.class === state.filter) &&
        Object.values(a).join(" ").toLowerCase().includes(q),
    );
  document.querySelector("#assetTable").innerHTML = shown.length
    ? shown.map((a) => assetRow(a)).join("")
    : '<div class="emptyState">No passports match this view.</div>';
}
function openPassport(id) {
  const a = state.assets.find((x) => x.id === id);
  if (!a) return;
  document.querySelector("#passportDetail").innerHTML =
    `<span class="kicker">ASSET PASSPORT · VERSION ${a.version || 1}</span><h2>${esc(a.name)}</h2>${pill(a.status)}<div class="detailGrid"><div><small>Asset ID</small><b>${esc(a.id)}</b></div><div><small>Class</small><b>${esc(a.class)}</b></div><div><small>Jurisdiction</small><b>${esc(a.jurisdiction)}</b></div><div><small>Custodian</small><b>${esc(a.custodian || "Synthetic custodian")}</b></div><div><small>Gross value</small><b>${fmt(a.gross)}</b></div><div><small>Potentially available</small><b>${fmt(a.gross - a.encumbered)}</b></div></div><h3>Evidence references</h3><div class="evidenceList">${(a.evidence || ["Ownership record", "Custody attestation", "Valuation record"]).map((e, i) => `<div><i>✓</i><span><b>${esc(e)}</b><small>REF-${a.id}-${i + 1} · synthetic · current</small></span></div>`).join("")}</div><h3>Policy record</h3><p>${esc(a.policy)}. This is a scoped simulation state, not a legal, regulatory, or Sharia determination.</p>`;
  document.querySelector("#passportDialog").showModal();
}
function renderRisk() {
  const base = totals(),
    t = totals(state.scenario),
    loss = base.gross - t.stressed;
  document.querySelector("#riskMetrics").innerHTML = [
    metric(
      "Scenario value",
      fmt(t.stressed),
      loss ? `−${fmt(loss)} stress loss` : "No shock active",
      loss ? "bad" : "good",
    ),
    metric(
      "Available after shock",
      fmt(t.available),
      pct(t.available / base.gross) + " of original gross",
      t.available < base.available ? "bad" : "good",
    ),
    metric(
      "Liquidity capacity",
      pct(scenarios[state.scenario].liquidity),
      "Synthetic market depth",
      state.scenario === "base" ? "good" : "warn",
    ),
    metric(
      "Active scenario",
      scenarios[state.scenario].name,
      state.scenario === "base" ? "Baseline monitoring" : "Controls triggered",
      state.scenario === "base" ? "good" : "warn",
    ),
  ].join("");
  document.querySelector("#scenarioButtons").innerHTML = Object.entries(
    scenarios,
  )
    .filter(([k]) => k !== "base")
    .map(
      ([k, s]) =>
        `<button class="scenarioCard ${state.scenario === k ? "active" : ""}" data-scenario="${k}"><span>${esc(s.name)}</span><small>${Object.keys(s.losses).length} exposure classes</small></button>`,
    )
    .join("");
  document.querySelector("#stressOutput").innerHTML =
    `<div><span>Original gross</span><b>${fmt(base.gross)}</b></div><div><span>Stressed gross</span><b>${fmt(t.stressed)}</b></div><div><span>Value impact</span><b class="${loss ? "badText" : ""}">${loss ? "−" : ""}${fmt(loss)}</b></div>`;
  document.querySelector("#controlResponse").innerHTML = scenarios[
    state.scenario
  ].controls
    .map((x) => `<li>${esc(x)}</li>`)
    .join("");
  document.querySelector("#exposureBars").innerHTML = state.assets
    .map((a) => {
      const stressed =
          a.gross * (1 - (scenarios[state.scenario].losses[a.class] || 0)),
        loss = a.gross - stressed;
      return `<div class="exposureRow"><span><b>${esc(a.name)}</b><small>${esc(a.class)}</small></span><div><i style="width:${(stressed / a.gross) * 100}%"></i></div><b>${loss ? `−${fmt(loss)}` : "Stable"}</b></div>`;
    })
    .join("");
}
function renderGovernance() {
  document.querySelector("#proposalList").innerHTML = proposals
    .map(
      (p) =>
        `<div class="proposal"><div><span class="kicker">${p.id} · ${p.age}</span><h3>${esc(p.title)}</h3><small>Required: ${p.reviews.join(" · ")}</small></div><div><span class="riskTag">${p.risk}</span>${pill(p.state)}</div></div>`,
    )
    .join("");
  document.querySelector("#approvalBodies").innerHTML = [
    "Board",
    "Risk Committee",
    "Treasury / ALCO",
    "Security Committee",
    "Compliance Committee",
    "Product Committee",
    "Sharia Supervisory Function",
  ]
    .map(
      (x, i) =>
        `<div><i>${String(i + 1).padStart(2, "0")}</i><span>${x}</span><b>${i === 6 ? "Scoped" : "Independent"}</b></div>`,
    )
    .join("");
}
function renderSettlement() {
  document.querySelector("#facilityAsset").innerHTML = state.assets
    .map(
      (a) =>
        `<option value="${a.id}">${esc(a.name)} · ${fmt(a.gross - a.encumbered)} free</option>`,
    )
    .join("");
  document.querySelector("#launchGates").innerHTML = [
    "Economic",
    "Legal / regulatory",
    "Reserves",
    "Technical",
    "Governance",
    "Distribution",
  ]
    .map(
      (g, i) =>
        `<div><i>${i < 2 ? "◐" : "○"}</i><span><b>${g}</b><small>${i < 2 ? "Research in progress" : "Not assessed"}</small></span></div>`,
    )
    .join("");
}
function route(view) {
  if (!document.getElementById(view)) view = "overview";
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.toggle("active", v.id === view));
  document
    .querySelectorAll(".navItem")
    .forEach((v) => v.classList.toggle("active", v.dataset.view === view));
  document.querySelector("#pageTitle").textContent = {
    overview: "Collateral overview",
    registry: "Asset passport registry",
    risk: "Risk & stress harness",
    governance: "Governance control plane",
    settlement: "Settlement simulation lab",
  }[view];
  history.replaceState(null, "", `#${view}`);
  window.scrollTo(0, 0);
}
function exportSnapshot() {
  const blob = new Blob(
      [
        JSON.stringify(
          {
            generated_at: new Date().toISOString(),
            mode: "SYNTHETIC_RESEARCH_ONLY",
            scenario: state.scenario,
            summary: totals(state.scenario),
            assets: state.assets,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    ),
    a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "scn-synthetic-snapshot.json";
  a.click();
  URL.revokeObjectURL(a.href);
}
function bind() {
  document.addEventListener("click", (e) => {
    const nav = e.target.closest("[data-view],[data-route]");
    if (nav) route(nav.dataset.view || nav.dataset.route);
    const filter = e.target.closest("[data-filter]");
    if (filter) {
      state.filter = filter.dataset.filter;
      renderRegistry();
    }
    const asset = e.target.closest("[data-asset]");
    if (asset) openPassport(asset.dataset.asset);
    const scenario = e.target.closest("[data-scenario]");
    if (scenario) {
      state.scenario = scenario.dataset.scenario;
      renderRisk();
    }
  });
  document.querySelector("#assetSearch").addEventListener("input", (e) => {
    state.search = e.target.value;
    renderRegistry();
  });
  document.querySelector("#resetScenario").onclick = () => {
    state.scenario = "base";
    renderRisk();
  };
  document.querySelector(".dialogClose").onclick = () =>
    document.querySelector("#passportDialog").close();
  document.querySelector("#exportBtn").onclick = exportSnapshot;
  document.querySelector("#wallet").onclick = () =>
    alert(
      "Demo access only. Wallet connectivity and live execution are intentionally excluded.",
    );
  document.querySelector("#settlementForm").onsubmit = (e) => {
    e.preventDefault();
    const a = state.assets.find(
        (x) => x.id === document.querySelector("#facilityAsset").value,
      ),
      amount = Number(document.querySelector("#facilityAmount").value),
      eligible =
        a.status.includes("ELIGIBLE") || a.status === "VERIFIED_RECORD",
      within = amount <= (a.gross - a.encumbered) * 0.35;
    document.querySelector("#settlementResult").innerHTML =
      `<div class="decision ${eligible && within ? "candidate" : "blocked"}"><span>${eligible && within ? "CANDIDATE ROUTE" : "ROUTE BLOCKED"}</span><b>${esc(a.name)}</b><small>${fmt(amount)} · ${esc(document.querySelector("#facilityTerm").value)}</small></div><div class="checks"><div><i>${eligible ? "✓" : "!"}</i> Passport policy state</div><div><i>${within ? "✓" : "!"}</i> Public capacity check</div><div><i>✓</i> Encumbrance visibility</div><div><i>—</i> Live execution disabled</div></div><p>Indicative simulation only. Production terms require licensed counterparties, validated private risk models, legal review, and applicable policy approval.</p>`;
  };
}
async function init() {
  try {
    const res = await fetch("synthetic_assets.json");
    if (!res.ok) throw new Error("Asset data unavailable");
    state.assets = await res.json();
    document.querySelector("#asOf").textContent =
      `AS OF ${new Date().toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "2-digit" }).toUpperCase()}`;
    renderOverview();
    renderRegistry();
    renderRisk();
    renderGovernance();
    renderSettlement();
    bind();
    route(location.hash.slice(1) || "overview");
  } catch (e) {
    document.body.innerHTML = `<main class="fatal"><h1>Demo could not start</h1><p>${esc(e.message)}. Serve this directory over HTTP rather than opening the file directly.</p></main>`;
  }
}
init();
