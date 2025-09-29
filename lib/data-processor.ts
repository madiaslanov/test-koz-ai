import { RawEvent, AggregatedData, AggregationLevel, WhatIfParams } from '@/types';
import { DateRange } from 'react-day-picker';

const calculateMetrics = (data: {
    spend: number;
    revenue: number;
    clicks: number;
    impressions: number;
    leads: number;
    purchases: number;
}) => {
    return {
        roas: data.spend > 0 ? data.revenue / data.spend : 0,
        ctr: data.impressions > 0 ? data.clicks / data.impressions : 0,
        cpl: data.leads > 0 ? data.spend / data.leads : 0,
        cpc: data.clicks > 0 ? data.spend / data.clicks : 0,
        cac: data.purchases > 0 ? data.spend / data.purchases : 0,
        lead_to_purchase_cr: data.leads > 0 ? data.purchases / data.leads : 0,
    };
};

export const processData = (
    rawData: RawEvent[],
    level: AggregationLevel,
    filters: {
        dateRange?: DateRange;
        selectedManagers?: string[];
        selectedCategories?: string[];
        parentId?: string;
    },
    whatIfParams?: WhatIfParams
): AggregatedData[] => {
    let filteredData = rawData;

    if (filters.dateRange?.from && filters.dateRange?.to) {
        filteredData = filteredData.filter(d => {
            const eventDate = new Date(d.timestamp);
            return eventDate >= filters.dateRange!.from! && eventDate <= filters.dateRange!.to!;
        });
    }
    if (filters.selectedManagers?.length) {
        filteredData = filteredData.filter(d => filters.selectedManagers!.includes(d.manager));
    }
    if (filters.selectedCategories?.length) {
        filteredData = filteredData.filter(d => filters.selectedCategories!.includes(d.category));
    }
    if (filters.parentId) {
        if (level === 'channel') {
            filteredData = filteredData.filter(d => d.campaign_id === filters.parentId);
        } else if (level === 'project') {
            filteredData = filteredData.filter(d => d.channel_id === filters.parentId);
        }
    }

    const budgetMultiplier = whatIfParams?.budgetMultiplier ?? 1;
    const conversionMultiplier = whatIfParams?.conversionMultiplier ?? 1;

    const aggregationMap = new Map<string, any>();

    filteredData.forEach(event => {
        const id = event[`${level}_id`];
        const name = event[`${level}_name`];

        if (!aggregationMap.has(id)) {
            aggregationMap.set(id, { id, name, impressions: 0, clicks: 0, spend: 0, leads: 0, purchases: 0, revenue: 0 });
        }

        const current = aggregationMap.get(id);
        const adjustedSpend = event.spend * budgetMultiplier;
        const adjustedLeads = event.leads * conversionMultiplier;
        const leadToPurchaseCR = event.leads > 0 ? event.purchases / event.leads : 0;
        const adjustedPurchases = adjustedLeads * leadToPurchaseCR;
        const avgRevenuePerPurchase = event.purchases > 0 ? event.revenue / event.purchases : 0;
        const adjustedRevenue = adjustedPurchases * avgRevenuePerPurchase;

        current.impressions += event.impressions;
        current.clicks += event.clicks;
        current.spend += adjustedSpend;
        current.leads += adjustedLeads;
        current.purchases += adjustedPurchases;
        current.revenue += adjustedRevenue;
    });

    return Array.from(aggregationMap.values()).map(item => {
        const metrics = calculateMetrics(item);
        return { ...item, ...metrics };
    });
};

export const generateInsights = (data: AggregatedData[], level: AggregationLevel): string[] => {
    const insights: string[] = [];
    if (data.length === 0) return ["Нет данных для анализа."];

    const sortedByRevenue = [...data].sort((a, b) => b.revenue - a.revenue);
    const sortedByRoas = [...data].sort((a, b) => b.roas - a.roas);

    insights.push(`Самая прибыльная ${level === 'campaign' ? 'кампания' : (level === 'channel' ? 'канал' : 'проект')}: "${sortedByRevenue[0].name}" с выручкой ${sortedByRevenue[0].revenue.toFixed(0)} руб.`);
    insights.push(`Самый высокий ROAS у "${sortedByRoas[0].name}" (${sortedByRoas[0].roas.toFixed(2)}x).`);

    const unprofitable = data.filter(d => d.roas < 1 && d.spend > 0);
    if (unprofitable.length > 0) {
        insights.push(`Обнаружено ${unprofitable.length} убыточных ${unprofitable.length > 1 ? 'элементов' : 'элемент'} (ROAS < 1). Стоит пересмотреть: ${unprofitable.map(u => u.name).slice(0,2).join(', ')}.`);
    }

    const highCpl = data.filter(d => d.cpl > (data.reduce((acc, i) => acc + i.cpl, 0) / data.length) * 1.5);
    if (highCpl.length > 0) {
        insights.push(`Стоимость лида значительно выше средней у: ${highCpl.map(u => u.name).slice(0,2).join(', ')}.`);
    }

    return insights;
}