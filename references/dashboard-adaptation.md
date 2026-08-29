# Dashboard adaptation reference

Read this file when adapting the bundled dashboard template to a new financial report.

## 1. Establish the reporting basis

Record these facts before editing the page:

- company name, ticker, fiscal quarter, quarter-end date, and release date;
- current comparison basis: year over year, quarter over quarter, or both;
- source currency and original scale;
- target display scale requested by the user;
- which measures are GAAP, Non-GAAP, reported, or derived;
- whether prior Non-GAAP values were recast under a new definition.

Use the company release or supplied filing as the primary source. Do not combine values from incompatible periods or accounting definitions.

## 2. Normalize monetary units

Convert every monetary field once in the raw data object and keep all charts on that same scale. Do not only rename the unit label.

Common conversions:

| Source disclosure | Target display | Conversion |
|---|---|---|
| USD millions | 亿美元 | divide by 100 |
| USD billions | 亿美元 | multiply by 10 |
| RMB millions | 亿元 | divide by 100 |
| RMB billions | 亿元 | multiply by 10 |

Per-share figures remain in currency per share. Margins and growth rates remain percentages.

## 3. Map the data

The template keeps monetary data in `D.current` and `D.prior`. Replace every value, including cash flow and Non-GAAP fields. If a field is unavailable, remove its chart series or section instead of using zero.

For a segment value inferred from a rounded growth rate:

```text
prior = current / (1 + disclosed_growth_rate)
```

Mark inferred values in the relevant chart description and footer. Expect small differences from consolidated revenue when segment amounts are rounded.

## 4. Reconcile the Sankey

Use an income-statement flow that matches the source's line items. A common positive-flow structure is:

```text
segments -> revenue
revenue -> cost of revenue + gross profit
gross profit -> operating expenses + operating income
operating income + other income -> pretax income
pretax income -> tax + net income
```

Test these identities within rounding tolerance:

```text
revenue - cost of revenue = gross profit
gross profit - operating expenses = operating income
operating income + net other income = pretax income
pretax income - tax = net income
```

If other income is a loss, model it as an outflow rather than a negative Sankey edge. If multiple expense lines exist, their sum must equal total operating expenses. Use the source's actual income-statement structure when it differs from this example.

Disable the Sankey entrance animation when deterministic screenshots are required. Keep adjacency emphasis and tooltips enabled.

## 5. Apply visual semantics

- Company identity and categorical series: company brand palette.
- Positive period-over-period change: red `#dc2626`.
- Negative period-over-period change: green `#168a62`.
- Expenses in the Sankey: warm red family.
- Profit nodes: a distinct, consistent positive-result color; this is categorical and does not override the red-up/green-down rule for changes.
- Prior-period comparison bars: neutral gray.

Do not color all financial amounts red or green. The convention applies when color communicates direction of change.

## 6. Adapt the content

Update all of the following:

- HTML title, metadata, header, source line, ticker, period, and unit;
- company mark and CSS brand variables;
- the local official logo asset used by the Sankey, including its filename, `alt` text, transparent treatment, and clear space;
- raw data, KPI definitions, node labels, series labels, tooltips, and table rows;
- management guidance and any disclosure-specific commentary;
- footer notes on units, derivations, accounting changes, and investment-risk disclaimer.

Search for stale template tokens before delivery:

```bash
rg -n "NVIDIA|NVDA|FY2027|2026-07-26|962\.21|890\.0" OUTPUT_DIRECTORY
```

Change the search terms when the template asset has been updated to a different canonical example.

## 7. Validate behavior

Run a JavaScript syntax check:

```bash
node --check OUTPUT_DIRECTORY/app.js
```

For a lightweight initialization check, mock `document`, `window`, and `echarts.init`, then require `app.js`. Ensure every chart option includes at least one series.

When Firefox or Chromium is available, render a desktop screenshot around 1440 px wide and a mobile screenshot around 390 px wide. Inspect:

- chart initialization and absence of blank panels;
- Sankey node order, link completeness, and label collisions;
- correct red-up/green-down colors;
- unit consistency in cards, axes, tooltips, and tables;
- horizontal access to the full Sankey on mobile;
- readable non-title typography in descriptions, legends, axes, labels, tables, and notes;
- a locally stored official company logo centered in unused Sankey space, with no visible background rectangle and no blocked hover interaction;
- table overflow behavior and readable footer notes.

Use [visual-polish.md](visual-polish.md) for typography baselines, local Sankey collision fixes, transparent-logo handling, and desktop/mobile visual acceptance checks.
