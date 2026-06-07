'use client';

import { Chart as HighchartsReactChart } from '@highcharts/react';
import * as React from 'react';
import { useMemo } from 'react';

import { buildHighchartsTheme, resolveChartColor } from './chart-theme';
import { useResolvedTheme } from './hooks/use-resolved-theme';
import { cn } from './lib/utils';

import type { ComponentProps } from 'react';

type HighchartsChartOptions = NonNullable<ComponentProps<typeof HighchartsReactChart>['options']>;
type ChartSeries = NonNullable<HighchartsChartOptions['series']>[number];

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

type ChartContextValue = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextValue | null>(null);

export function useChartConfig(): ChartConfig {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChartConfig must be used within a <ChartContainer />');
  }
  return context.config;
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
}) {
  const uniqueId = React.useId();
  const chartId = id ?? uniqueId.replace(/:/g, '');

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          'flex aspect-video w-full justify-center text-xs [&_.highcharts-container]:font-[inherit]',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
}

export interface ChartProps {
  options: HighchartsChartOptions;
  className?: string;
}

/** Highcharts chart synced with the document light/dark theme and ChartConfig colors. */
export function Chart({ options, className }: ChartProps) {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';
  const config = React.useContext(ChartContext)?.config;

  const mergedOptions = useMemo((): HighchartsChartOptions => {
    const theme = buildHighchartsTheme(isDark);
    const series = options.series?.map((seriesItem: ChartSeries, index: number) => {
      if (typeof seriesItem !== 'object' || seriesItem === null) {
        return seriesItem;
      }
      const seriesName =
        'name' in seriesItem && typeof seriesItem.name === 'string'
          ? seriesItem.name
          : `series-${index}`;
      const configColor = config?.[seriesName]?.color;
      const color =
        configColor ??
        ('color' in seriesItem && typeof seriesItem.color === 'string'
          ? seriesItem.color
          : resolveChartColor(seriesName, index));

      return { ...seriesItem, color };
    });

    return {
      ...theme,
      ...options,
      series,
    };
  }, [options, isDark, config]);

  return (
    <HighchartsReactChart
      containerProps={{ className: cn('size-full min-h-[200px]', className) }}
      options={mergedOptions}
    />
  );
}
