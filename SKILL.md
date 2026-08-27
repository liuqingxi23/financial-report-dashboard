---
name: financial-report-dashboard
description: Create or update a polished, self-contained Chinese financial-results visualization from an earnings PDF, press release, or financial tables. Use for public-company quarterly earnings dashboards that need KPI cards, an income-statement Sankey, comparison charts, guidance, a detailed table, financial reconciliation, and responsive ECharts output. Do not use for generic dashboards unrelated to financial reporting.
---

# Financial Report Dashboard

Build a static ECharts financial-results dashboard that is accurate enough to audit and polished enough to deliver directly.

## Use the template

For a new dashboard, run:

```bash
python3 scripts/scaffold_dashboard.py OUTPUT_DIRECTORY
```

The scaffold is a working NVIDIA example, not neutral placeholder data. Replace every company-specific value, label, period, source note, outlook item, and footnote before delivery. Keep `echarts.min.js` local so the dashboard works offline.

Before adapting the scaffold, read [references/dashboard-adaptation.md](references/dashboard-adaptation.md). It defines unit conversion, period selection, accounting flow, color semantics, and validation requirements.

## Workflow

1. Inspect the source document and any user-provided reference dashboard. Preserve the requested output directory and unrelated files.
2. Extract tables with a layout-preserving PDF tool when available. Build a small data audit containing current period, comparison period, units, GAAP/Non-GAAP status, and whether each value is reported or derived.
3. Scaffold the dashboard, then adapt `index.html` and `app.js`. Prefer changing the template over rewriting it unless the user's reference calls for a materially different structure.
4. Use the company's brand color for identity and chart categories. Use red for increases and green for decreases only where the visual encodes change, following the Chinese-market convention.
5. Keep reported values distinct from derived values. Identify inferred business-segment figures or rounding differences in the page notes.
6. Verify accounting identities, displayed units, period labels, and GAAP/Non-GAAP comparability before visual review.
7. Run JavaScript syntax and runtime smoke checks. Render desktop and mobile screenshots when a browser is available; inspect the full Sankey after animations finish.

## Delivery standard

The output should normally contain:

- four headline KPI cards;
- an income-statement Sankey whose flows reconcile;
- revenue mix and expense comparison charts;
- GAAP/Non-GAAP profitability and margin views when both exist;
- cash-flow or balance-sheet highlights when disclosed;
- forward guidance when disclosed;
- a detailed comparison table and source/method notes.

Do not invent unavailable metrics to fill a section. Remove or replace sections that do not fit the company's disclosures. The final page must be responsive, self-contained, free of stale sample data, and explicit about units and fiscal-period dates.

## Required checks

- `node --check OUTPUT_DIRECTORY/app.js`
- Load `app.js` with lightweight DOM/ECharts mocks or open the page in a browser to catch initialization errors.
- Search the output for stale sample company names, dates, units, and values.
- Confirm income-statement equations within the source's rounding precision.
- Confirm every percentage change uses the correct denominator and sign.
- Confirm mobile access to wide Sankey content, usually via horizontal scrolling rather than compressed labels.

