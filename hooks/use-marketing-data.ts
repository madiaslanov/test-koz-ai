import { useQuery } from '@tanstack/react-query';
import { useDashboardStore } from '@/store/dashboard-store';
import { RawEvent, AggregationLevel, AggregatedData } from '@/types';
import { processData, generateInsights } from '@/lib/data-processor';

const fetcher = async (): Promise<RawEvent[]> => {
    const res = await fetch('/data.json');
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
};

export function useMarketingData() {
    const { data: rawData = [] } = useQuery<RawEvent[]>({
        queryKey: ['marketingData'],
        queryFn: fetcher,
    });

    const {
        dateRange,
        selectedManagers,
        selectedCategories,
        drilldownPath,
        whatIfParams,
    } = useDashboardStore();

    const currentLevel: AggregationLevel = drilldownPath.length === 0 ? 'campaign' :
        drilldownPath.length === 1 ? 'channel' :
            'project';

    const parentId = drilldownPath.length > 0 ? drilldownPath[drilldownPath.length - 1].id : undefined;

    const filters = {
        dateRange,
        selectedManagers,
        selectedCategories,
        parentId,
    };

    const processedData: AggregatedData[] = processData(rawData, currentLevel, filters, whatIfParams);
    const insights = generateInsights(processedData, currentLevel);

    const uniqueValues = {
        managers: [...new Set(rawData.map(d => d.manager))],
        categories: [...new Set(rawData.map(d => d.category))],
    };

    return {
        data: processedData,
        level: currentLevel,
        insights,
        uniqueValues,
        isLoading: !rawData.length,
        drilldownPath,
    };
}