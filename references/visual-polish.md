# Visual polish reference

Read this file before styling or visually reviewing a financial dashboard. The values below are proven starting points, not immutable constants; adjust them for canvas width, label length, script, and information density while preserving the hierarchy and checks.

## 1. Keep non-title text readable

Do not enlarge page or card titles merely because supporting text is too small. Increase supporting text locally and review color, weight, and line height together.

Use this baseline hierarchy:

| Content | Starting point |
|---|---|
| Hero summary | 16–17 px, line-height about 1.7 |
| Period pills and prominent supporting labels | 14–15 px |
| Card descriptions | 14 px with a darker muted color and medium weight |
| Chart legends | 12 px, medium weight |
| Axis ticks and unit names | 13 px; use 14 px for important category labels |
| Chart data labels | 11–12 px |
| Sankey node name / amount | 14 px / 12 px |
| Table body / header and basis notes | 14 px / 12 px |
| Footer and genuinely minor notes | at least 12 px when space permits |

Avoid a global `.desc` change when only dense comparison cards need larger copy. Add a local class such as `content-lg` so unrelated layouts do not regress. For ECharts, shared objects reduce inconsistent typography:

```js
const LEGEND_TEXT = { color: '#4f4b43', fontSize: 12, fontWeight: 650 };
const AXIS_TEXT = { color: '#4f4b43', fontSize: 13, fontWeight: 600 };
```

Set `grid.containLabel: true` when axis text grows. Keep grid lines light; a slightly darker axis line is enough. After increasing text, check that legends do not compress the plot and that multiline labels have sufficient line height.

## 2. Preserve table hierarchy

Use about 14 px and normal weight for ordinary table rows. Bold the header and genuine subtotal or key-result rows only. Do not make the whole table bold. Keep the table horizontally scrollable on narrow screens rather than shrinking its text to fit.

## 3. Refine the Sankey locally

Start around `nodeWidth: 24`, `nodeGap: 28`, `label.distance: 9`, with 14 px node names and 12 px amounts. When labels collide, fix the smallest affected area in this order:

1. Apply a node-level `label.offset`.
2. Adjust the nearby gap or the chart's `top`/`bottom` reservation.
3. Shorten or intentionally wrap the label.
4. Increase canvas height only when the conflict is not local.

Do not change the entire node depth or canvas width for one collision. On mobile, keep a wide Sankey canvas and expose it through horizontal scrolling.

## 4. Add the company logo to every Sankey

Use an official logo asset and store it beside the page so the dashboard remains offline. Prefer an official PNG or SVG with a real alpha channel, and follow the owner's brand and trademark usage rules. Do not redraw a formal company mark with a generative tool. Check the file itself or the final composite: an RGBA filename or a checkerboard preview does not prove that any pixel is transparent.

Place the logo in a positioned wrapper that has the same width as the full Sankey canvas:

```html
<div class="chart-scroll">
  <div class="sankey-stage">
    <div id="sankey" class="chart tall"></div>
    <div class="sankey-brand">
      <img class="sankey-brand-logo" src="company-logo.png" alt="公司名称">
    </div>
  </div>
</div>
```

```css
.sankey-stage { position: relative; min-width: 100%; }
.sankey-brand {
  position: absolute;
  z-index: 3;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  background: transparent;
  pointer-events: none;
}
.sankey-brand-logo { display: block; width: 180px; height: auto; }
```

Reserve enough empty chart space that the logo does not cover nodes, links, or labels. Use a width around 160–220 px as a starting range, respecting the company's clear-space and minimum-size rules.

If the only official asset has a flat white background and the dashboard has a plain light background, `mix-blend-mode: multiply` can be a visual fallback. For dark, colored, or textured backgrounds, obtain a true transparent asset instead. Never add a white card, border, radius, or shadow around the Sankey logo. Set `pointer-events: none` so the overlay cannot block Sankey hover behavior.

## 5. Visual acceptance checks

Inspect screenshots around 1440 px and 2000 px wide, plus a mobile viewport around 390 px:

- non-title copy can be read without zooming, and title sizes did not grow unintentionally;
- legends, axes, data labels, long descriptions, and table columns do not clip or collide;
- ordinary table rows stay regular-weight while headers and subtotals remain distinct;
- Sankey labels do not overlap after animations finish;
- the logo is centered in intentional empty space, has no visible rectangular background, and does not cover the flow;
- on mobile, the logo remains centered on the full scrollable Sankey canvas rather than the viewport.
