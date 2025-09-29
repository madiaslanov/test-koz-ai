"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMarketingData } from '@/hooks/use-marketing-data';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DataTable } from '@/components/dashboard/DataTable';
import { Charts } from '@/components/dashboard/Charts';
import { WhatIfAnalysis } from '@/components/dashboard/WhatIfAnalysis';
import { Insights } from '@/components/dashboard/Insights';
import { DrilldownBreadcrumb } from '@/components/dashboard/DrilldownBreadcrumb';
import { formatCurrency, formatPercent } from '@/lib/utils';

const queryClient = new QueryClient();

function Dashboard() {
  const { data, level, insights, isLoading } = useMarketingData();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Загрузка данных...</div>;
  }

  const totals = data.reduce((acc, item) => ({
    revenue: acc.revenue + item.revenue,
    spend: acc.spend + item.spend,
    clicks: acc.clicks + item.clicks,
    impressions: acc.impressions + item.impressions,
  }), { revenue: 0, spend: 0, clicks: 0, impressions: 0 });

  const totalRoas = totals.spend > 0 ? totals.revenue / totals.spend : 0;
  const totalCtr = totals.impressions > 0 ? totals.clicks / totals.impressions : 0;

  return (
      <div className="flex flex-col min-h-screen bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
          <h1 className="text-2xl font-bold">Marketing Performance Dashboard</h1>
        </header>
        <FilterPanel />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Общая выручка" value={formatCurrency(totals.revenue)} />
            <MetricCard title="Общие затраты" value={formatCurrency(totals.spend)} />
            <MetricCard title="Общий ROAS" value={`${totalRoas.toFixed(2)}x`} />
            <MetricCard title="Общий CTR" value={formatPercent(totalCtr)} />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className='lg:col-span-2 space-y-6'>
              <Charts data={data} />
              <DrilldownBreadcrumb />
              <DataTable data={data} level={level} />
            </div>
            <div className="space-y-6">
              <WhatIfAnalysis />
              <Insights insights={insights}/>
            </div>
          </div>
        </main>
      </div>
  );
}

export default function Page() {
  return (
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
  )
}