// NVIDIA Q2 FY2027 财报可视化
// 数据来源：用户提供的 NVIDIA 财报 PDF；金额单位均为亿美元，EPS 除外。

const D = {
  current: {
    revenue: 962.21,
    dataCenter: 890.0,
    edge: 72.0,
    cost: 240.79,
    grossProfit: 721.42,
    rd: 70.54,
    sga: 13.54,
    opex: 84.08,
    opIncome: 637.34,
    otherIncome: 77.73,
    pretaxIncome: 715.07,
    tax: 118.19,
    netIncome: 596.88,
    dilutedEPS: 2.46,
    nonGaapOpIncome: 639.56,
    nonGaapNetIncome: 539.54,
    nonGaapEPS: 2.22,
    operatingCashFlow: 240.77,
    freeCashFlow: 213.41,
  },
  prior: {
    revenue: 467.43,
    dataCenter: 890.0 / 2.17,
    edge: 72.0 / 1.27,
    cost: 128.90,
    grossProfit: 338.53,
    rd: 42.91,
    sga: 11.22,
    opex: 54.13,
    opIncome: 284.40,
    otherIncome: 27.66,
    pretaxIncome: 312.06,
    tax: 47.84,
    netIncome: 264.22,
    dilutedEPS: 1.08,
    nonGaapOpIncome: 285.41,
    nonGaapNetIncome: 247.63,
    nonGaapEPS: 1.01,
    operatingCashFlow: 153.65,
    freeCashFlow: 134.50,
  },
};

const COLORS = {
  green: '#76b900',
  greenDark: '#4f8000',
  greenSoft: '#a8d45a',
  expense: '#e15b4b',
  profit: '#168a62',
  subtotal: '#52606d',
  prior: '#a7afa2',
  grid: '#edf0ea',
  text: '#33402f',
  muted: '#657064',
  up: '#dc2626',
  down: '#168a62',
};

const fmt = (n, digits = 1) => Number(n).toFixed(digits);
const yoy = (cur, prev) => ((cur - prev) / Math.abs(prev)) * 100;
const margin = (value, revenue) => (value / revenue) * 100;

function baseChart(spec) {
  const { grid, tooltip, ...rest } = spec;
  return {
    animationDuration: 700,
    animationEasing: 'cubicOut',
    textStyle: { fontFamily: 'Inter, PingFang SC, Microsoft YaHei, sans-serif' },
    grid: { left: 22, right: 22, top: 48, bottom: 22, containLabel: true, ...grid },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(29, 42, 25, .95)',
      borderWidth: 0,
      padding: [10, 13],
      textStyle: { color: '#fff', fontSize: 12 },
      extraCssText: 'border-radius:8px;box-shadow:0 10px 28px rgba(23,33,20,.2)',
      valueFormatter: value => `${fmt(value, 2)} 亿美元`,
      ...tooltip,
    },
    ...rest,
  };
}

function renderKPIs() {
  const c = D.current;
  const p = D.prior;
  const items = [
    { label: '营业收入', value: c.revenue, delta: yoy(c.revenue, p.revenue), unit: '亿美元' },
    { label: '数据中心收入', value: c.dataCenter, delta: 117, unit: '亿美元' },
    { label: '营业利润（GAAP）', value: c.opIncome, delta: yoy(c.opIncome, p.opIncome), unit: '亿美元' },
    { label: '净利润（GAAP）', value: c.netIncome, delta: yoy(c.netIncome, p.netIncome), unit: '亿美元' },
  ];
  document.getElementById('kpis').innerHTML = items.map(item => `
    <article class="kpi">
      <div class="label">${item.label}</div>
      <div class="value">${fmt(item.value, 1)}<span class="unit">${item.unit}</span></div>
      <div class="delta ${item.delta >= 0 ? 'up' : 'down'}">${item.delta >= 0 ? '▲' : '▼'} ${fmt(Math.abs(item.delta), 0)}% 同比</div>
    </article>
  `).join('');
}

function sankeyOption() {
  const c = D.current;
  const node = (name, title, value, kind, color, label) => ({
    name, title, amount: `${fmt(value, 1)} 亿美元`, kind,
    itemStyle: { color },
    ...(label ? { label } : {}),
  });
  const nodes = [
    node('dataCenter', '数据中心', c.dataCenter, 'income', COLORS.green),
    node('edge', '边缘计算', c.edge, 'incomeAlt', '#9ccd41'),
    node('revenue', '营业收入', c.revenue, 'income', COLORS.greenDark),
    node('cost', '营业成本', c.cost, 'expense', COLORS.expense),
    node('grossProfit', '毛利润', c.grossProfit, 'subtotal', COLORS.subtotal),
    node('rd', '研发费用', c.rd, 'expense', '#e97769'),
    node('sga', '销售、一般及行政', c.sga, 'expense', '#efa399'),
    node('opIncome', '营业利润', c.opIncome, 'profit', COLORS.profit),
    node('otherIncome', '其他收入净额', c.otherIncome, 'profit', '#51a886'),
    node('pretaxIncome', '税前利润', c.pretaxIncome, 'subtotal', COLORS.subtotal),
    node('tax', '所得税', c.tax, 'expense', COLORS.expense),
    node('netIncome', '净利润', c.netIncome, 'profit', COLORS.profit),
  ];
  const links = [
    { source: 'dataCenter', target: 'revenue', value: c.dataCenter },
    { source: 'edge', target: 'revenue', value: c.edge },
    { source: 'revenue', target: 'cost', value: c.cost },
    { source: 'revenue', target: 'grossProfit', value: c.grossProfit },
    { source: 'grossProfit', target: 'rd', value: c.rd },
    { source: 'grossProfit', target: 'sga', value: c.sga },
    { source: 'grossProfit', target: 'opIncome', value: c.opIncome },
    { source: 'opIncome', target: 'pretaxIncome', value: c.opIncome },
    { source: 'otherIncome', target: 'pretaxIncome', value: c.otherIncome },
    { source: 'pretaxIncome', target: 'tax', value: c.tax },
    { source: 'pretaxIncome', target: 'netIncome', value: c.netIncome },
  ];
  return {
    backgroundColor: 'transparent',
    animation: false,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(29, 42, 25, .96)',
      borderWidth: 0,
      padding: [10, 13],
      textStyle: { color: '#fff', fontSize: 12 },
      extraCssText: 'border-radius:8px;box-shadow:0 10px 28px rgba(23,33,20,.2)',
      formatter: p => {
        if (p.dataType === 'edge') {
          const source = nodes.find(n => n.name === p.data.source);
          const target = nodes.find(n => n.name === p.data.target);
          return `${source.title} → ${target.title}<br><b style="font-size:15px">${fmt(p.value, 2)} 亿美元</b>`;
        }
        return `${p.data.title}<br><b style="font-size:15px">${p.data.amount}</b>`;
      },
    },
    series: [{
      type: 'sankey',
      left: '4%', right: '13%', top: 26, bottom: 18,
      layoutIterations: 32,
      nodeWidth: 24,
      nodeGap: 25,
      draggable: false,
      emphasis: { focus: 'adjacency' },
      itemStyle: { borderWidth: 0, borderRadius: 3 },
      lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.27 },
      label: {
        position: 'right',
        distance: 8,
        formatter: p => `{${p.data.kind}Name|${p.data.title}}\n{${p.data.kind}Value|${p.data.amount}}`,
        rich: {
          incomeName: { color: COLORS.greenDark, fontSize: 13, fontWeight: 700, lineHeight: 20 },
          incomeValue: { color: '#69962b', fontSize: 11, fontWeight: 600, lineHeight: 16 },
          incomeAltName: { color: '#6c932d', fontSize: 13, fontWeight: 700, lineHeight: 20 },
          incomeAltValue: { color: '#799f42', fontSize: 11, fontWeight: 600, lineHeight: 16 },
          expenseName: { color: '#c94d40', fontSize: 13, fontWeight: 700, lineHeight: 20 },
          expenseValue: { color: '#bd675d', fontSize: 11, fontWeight: 600, lineHeight: 16 },
          profitName: { color: COLORS.profit, fontSize: 13, fontWeight: 700, lineHeight: 20 },
          profitValue: { color: '#3d8e72', fontSize: 11, fontWeight: 600, lineHeight: 16 },
          subtotalName: { color: COLORS.subtotal, fontSize: 13, fontWeight: 700, lineHeight: 20 },
          subtotalValue: { color: '#697681', fontSize: 11, fontWeight: 600, lineHeight: 16 },
        },
      },
      data: nodes,
      links,
    }],
  };
}

function revenueMixOption() {
  const c = D.current;
  const p = D.prior;
  return baseChart({
    legend: { top: 0, textStyle: { color: COLORS.muted, fontSize: 11 } },
    xAxis: { type: 'category', data: ['Q2 FY2026', 'Q2 FY2027'], axisTick: { show: false }, axisLine: { lineStyle: { color: '#dfe5da' } } },
    yAxis: { type: 'value', name: '亿美元', splitLine: { lineStyle: { color: COLORS.grid } } },
    series: [
      {
        name: '数据中心', type: 'bar', stack: 'revenue', barWidth: 68,
        data: [p.dataCenter, c.dataCenter],
        itemStyle: { color: COLORS.greenDark },
        label: { show: true, position: 'inside', color: '#fff', fontSize: 11, fontWeight: 700, formatter: p => fmt(p.value, 1) },
      },
      {
        name: '边缘计算', type: 'bar', stack: 'revenue', barWidth: 68,
        data: [p.edge, c.edge],
        itemStyle: { color: COLORS.greenSoft, borderRadius: [5, 5, 0, 0] },
        label: { show: true, position: 'inside', color: '#31421f', fontSize: 10, fontWeight: 700, formatter: p => fmt(p.value, 1) },
      },
    ],
    graphic: [
      { type: 'text', right: 12, top: 45, style: { text: '数据中心 +117% YoY', fill: COLORS.up, fontSize: 11, fontWeight: 700 } },
      { type: 'text', right: 12, top: 63, style: { text: '边缘计算 +27% YoY', fill: COLORS.up, fontSize: 11, fontWeight: 700 } },
    ],
  });
}

function expensesOption() {
  const c = D.current;
  const p = D.prior;
  const categories = ['营业成本', '研发', '销售及管理'];
  const prior = [p.cost, p.rd, p.sga];
  const current = [c.cost, c.rd, c.sga];
  return baseChart({
    legend: { top: 0, textStyle: { color: COLORS.muted, fontSize: 11 } },
    xAxis: { type: 'category', data: categories, axisTick: { show: false }, axisLine: { lineStyle: { color: '#dfe5da' } }, axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', name: '亿美元', splitLine: { lineStyle: { color: COLORS.grid } } },
    series: [
      {
        name: 'Q2 FY2026', type: 'bar', data: prior, barMaxWidth: 38,
        itemStyle: { color: COLORS.prior, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', color: '#7d8679', fontSize: 10, formatter: p => fmt(p.value, 1) },
      },
      {
        name: 'Q2 FY2027', type: 'bar', data: current, barMaxWidth: 38,
        itemStyle: { color: COLORS.green, borderRadius: [4, 4, 0, 0] },
        label: {
          show: true, position: 'top', distance: 4,
          formatter: p => `{v|${fmt(p.value, 1)}}\n{y|+${fmt(yoy(p.value, prior[p.dataIndex]), 0)}%}`,
          rich: {
            v: { color: COLORS.text, fontSize: 10, lineHeight: 16 },
            y: { color: COLORS.up, backgroundColor: '#fef2f2', borderRadius: 3, padding: [1, 4], fontSize: 9 },
          },
        },
      },
    ],
  });
}

function profitabilityOption() {
  const c = D.current;
  const p = D.prior;
  const periods = ['Q2 FY2026', 'Q2 FY2027'];
  const gaapOp = [p.opIncome, c.opIncome];
  const nonGaapOp = [p.nonGaapOpIncome, c.nonGaapOpIncome];
  const gaapNet = [p.netIncome, c.netIncome];
  const nonGaapNet = [p.nonGaapNetIncome, c.nonGaapNetIncome];
  const revenue = [p.revenue, c.revenue];
  return baseChart({
    grid: { top: 76 },
    legend: { top: 0, left: 'center', width: '95%', itemWidth: 16, textStyle: { color: COLORS.muted, fontSize: 10 } },
    xAxis: { type: 'category', data: periods, axisTick: { show: false }, axisLine: { lineStyle: { color: '#dfe5da' } } },
    yAxis: [
      { type: 'value', name: '亿美元', splitLine: { lineStyle: { color: COLORS.grid } } },
      { type: 'value', name: '利润率', min: 40, max: 70, axisLabel: { formatter: '{value}%' }, splitLine: { show: false } },
    ],
    tooltip: {
      formatter: params => {
        const lines = params.map(p => `${p.marker}${p.seriesName}：<b>${fmt(p.value, 1)}${p.seriesType === 'line' ? '%' : ' 亿美元'}</b>`);
        return `${params[0].axisValue}<br>${lines.join('<br>')}`;
      },
    },
    series: [
      { name: '营业利润 GAAP', type: 'bar', data: gaapOp, itemStyle: { color: '#a8d45a' }, barMaxWidth: 35 },
      { name: '营业利润 Non-GAAP', type: 'bar', data: nonGaapOp, itemStyle: { color: COLORS.greenDark }, barMaxWidth: 35 },
      { name: '净利润 GAAP', type: 'bar', data: gaapNet, itemStyle: { color: '#72bea5' }, barMaxWidth: 35 },
      { name: '净利润 Non-GAAP', type: 'bar', data: nonGaapNet, itemStyle: { color: COLORS.profit }, barMaxWidth: 35 },
      {
        name: '营业利润率 GAAP', type: 'line', yAxisIndex: 1,
        data: gaapOp.map((v, i) => margin(v, revenue[i])),
        lineStyle: { color: COLORS.greenDark, width: 2 }, itemStyle: { color: COLORS.greenDark }, symbolSize: 8,
        label: { show: true, position: 'top', color: COLORS.greenDark, formatter: p => `${fmt(p.value, 1)}%` },
      },
      {
        name: '净利润率 GAAP', type: 'line', yAxisIndex: 1,
        data: gaapNet.map((v, i) => margin(v, revenue[i])),
        lineStyle: { color: COLORS.profit, width: 2, type: 'dashed' }, itemStyle: { color: COLORS.profit }, symbol: 'diamond', symbolSize: 9,
        label: { show: true, position: 'bottom', color: COLORS.profit, formatter: p => `${fmt(p.value, 1)}%` },
      },
    ],
  });
}

function cashflowOption() {
  const c = D.current;
  const p = D.prior;
  const labels = ['经营现金流', '自由现金流'];
  const prior = [p.operatingCashFlow, p.freeCashFlow];
  const current = [c.operatingCashFlow, c.freeCashFlow];
  return baseChart({
    grid: { left: 26, right: 38, top: 40, bottom: 26 },
    legend: { top: 0, textStyle: { color: COLORS.muted, fontSize: 11 } },
    xAxis: { type: 'value', name: '亿美元', splitLine: { lineStyle: { color: COLORS.grid } } },
    yAxis: { type: 'category', data: labels, axisTick: { show: false }, axisLine: { show: false } },
    series: [
      {
        name: 'Q2 FY2026', type: 'bar', data: prior, barMaxWidth: 28,
        itemStyle: { color: COLORS.prior, borderRadius: [0, 5, 5, 0] },
        label: { show: true, position: 'right', color: '#778173', formatter: p => fmt(p.value, 1) },
      },
      {
        name: 'Q2 FY2027', type: 'bar', data: current, barMaxWidth: 28,
        itemStyle: { color: COLORS.green, borderRadius: [0, 5, 5, 0] },
        label: {
          show: true, position: 'right',
          formatter: p => `{v|${fmt(p.value, 1)}}  {y|+${fmt(yoy(p.value, prior[p.dataIndex]), 0)}% YoY}`,
          rich: { v: { color: COLORS.text, fontWeight: 700 }, y: { color: COLORS.up, fontSize: 10 } },
        },
      },
    ],
  });
}

function renderTable() {
  const c = D.current;
  const p = D.prior;
  const row = (name, prior, current, digits = 2, suffix = '') => {
    const change = yoy(current, prior);
    return `<tr><td>${name}</td><td>${fmt(prior, digits)}${suffix}</td><td>${fmt(current, digits)}${suffix}</td><td class="${change >= 0 ? 'pos' : 'neg'}">${change >= 0 ? '+' : ''}${fmt(change, 1)}%</td></tr>`;
  };
  const marginRow = (name, prior, current) => {
    const change = current - prior;
    return `<tr><td>${name}</td><td>${fmt(prior, 1)}%</td><td>${fmt(current, 1)}%</td><td class="${change >= 0 ? 'pos' : 'neg'}">${change >= 0 ? '+' : ''}${fmt(change, 1)} pts</td></tr>`;
  };
  document.getElementById('dataTable').innerHTML = `
    <thead><tr><th>项目</th><th>Q2 FY2026</th><th>Q2 FY2027</th><th>同比 / 变化</th></tr></thead>
    <tbody>
      ${row('营业收入', p.revenue, c.revenue)}
      ${row('营业成本', p.cost, c.cost)}
      <tr class="subtotal"><td>毛利润</td><td>${fmt(p.grossProfit, 2)}</td><td>${fmt(c.grossProfit, 2)}</td><td class="pos">+${fmt(yoy(c.grossProfit, p.grossProfit), 1)}%</td></tr>
      ${marginRow('毛利率（GAAP）', margin(p.grossProfit, p.revenue), margin(c.grossProfit, c.revenue))}
      ${row('研发费用', p.rd, c.rd)}
      ${row('销售、一般及行政费用', p.sga, c.sga)}
      ${row('营业费用合计', p.opex, c.opex)}
      <tr class="subtotal"><td>营业利润（GAAP）</td><td>${fmt(p.opIncome, 2)}</td><td>${fmt(c.opIncome, 2)}</td><td class="pos">+${fmt(yoy(c.opIncome, p.opIncome), 1)}%</td></tr>
      ${row('营业利润（Non-GAAP）', p.nonGaapOpIncome, c.nonGaapOpIncome)}
      ${row('其他收入净额', p.otherIncome, c.otherIncome)}
      ${row('所得税', p.tax, c.tax)}
      <tr class="subtotal"><td>净利润（GAAP）</td><td>${fmt(p.netIncome, 2)}</td><td>${fmt(c.netIncome, 2)}</td><td class="pos">+${fmt(yoy(c.netIncome, p.netIncome), 1)}%</td></tr>
      ${row('净利润（Non-GAAP）', p.nonGaapNetIncome, c.nonGaapNetIncome)}
      ${row('摊薄每股收益（GAAP）', p.dilutedEPS, c.dilutedEPS, 2, ' 美元')}
      ${row('自由现金流', p.freeCashFlow, c.freeCashFlow)}
    </tbody>`;
}

const charts = {
  sankey: echarts.init(document.getElementById('sankey')),
  revenueMix: echarts.init(document.getElementById('revenueMix')),
  expenses: echarts.init(document.getElementById('expenses')),
  profitability: echarts.init(document.getElementById('profitability')),
  cashflow: echarts.init(document.getElementById('cashflow')),
};

function renderAll() {
  renderKPIs();
  charts.sankey.setOption(sankeyOption(), true);
  charts.revenueMix.setOption(revenueMixOption(), true);
  charts.expenses.setOption(expensesOption(), true);
  charts.profitability.setOption(profitabilityOption(), true);
  charts.cashflow.setOption(cashflowOption(), true);
  renderTable();
}

renderAll();
window.addEventListener('resize', () => Object.values(charts).forEach(chart => chart.resize()));
