function readCssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') {
    return fallback;
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function buildHighchartsTheme(isDark: boolean): Record<string, unknown> {
  const foreground = readCssVar('--foreground', isDark ? '#f8fafc' : '#0f172a');
  const muted = readCssVar('--muted-foreground', isDark ? '#94a3b8' : '#64748b');
  const border = readCssVar('--border', isDark ? '#243044' : '#cbd5e1');
  const background = readCssVar('--card', isDark ? '#121a2b' : '#ffffff');
  const primary = readCssVar('--primary', isDark ? '#38bdf8' : '#0284c7');

  return {
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit',
      },
    },
    title: {
      style: { color: foreground },
    },
    subtitle: {
      style: { color: muted },
    },
    xAxis: {
      gridLineColor: border,
      lineColor: border,
      tickColor: border,
      labels: { style: { color: muted } },
      title: { style: { color: muted } },
    },
    yAxis: {
      gridLineColor: border,
      lineColor: border,
      tickColor: border,
      labels: { style: { color: muted } },
      title: { style: { color: muted } },
    },
    legend: {
      itemStyle: { color: foreground },
      itemHoverStyle: { color: primary },
    },
    tooltip: {
      backgroundColor: background,
      borderColor: border,
      style: { color: foreground },
    },
    plotOptions: {
      series: {
        animation: false,
      },
    },
    credits: { enabled: false },
  };
}

export function resolveChartColor(key: string, index: number): string {
  const fromKey = readCssVar(`--color-${key}`, '');
  if (fromKey) {
    return fromKey;
  }
  const slot = (index % 5) + 1;
  return readCssVar(`--chart-${slot}`, '#38bdf8');
}
