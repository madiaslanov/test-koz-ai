import { create } from 'zustand';
import { DateRange } from 'react-day-picker';
import { DrilldownPath } from '@/types';

interface WhatIfParams {
    budgetMultiplier: number;
    conversionMultiplier: number;
}

interface DashboardState {
    dateRange: DateRange | undefined;
    setDateRange: (range: DateRange | undefined) => void;
    selectedManagers: string[];
    setSelectedManagers: (managers: string[]) => void;
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;

    drilldownPath: DrilldownPath;
    setDrilldownPath: (path: DrilldownPath) => void;
    drilldown: (level: 'campaign' | 'channel' | 'project', id: string, name: string) => void;
    drillup: () => void;

    whatIfParams: WhatIfParams;
    setWhatIfParams: (params: Partial<WhatIfParams>) => void;

    resetFilters: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
    dateRange: undefined,
    setDateRange: (range) => set({ dateRange: range }),

    selectedManagers: [],
    setSelectedManagers: (managers) => set({ selectedManagers: managers }),

    selectedCategories: [],
    setSelectedCategories: (categories) => set({ selectedCategories: categories }),

    drilldownPath: [],
    setDrilldownPath: (path) => set({ drilldownPath: path }),
    drilldown: (level, id, name) => {
        const currentPath = get().drilldownPath;
        set({ drilldownPath: [...currentPath, { level, id, name }] });
    },
    drillup: () => {
        const currentPath = get().drilldownPath;
        set({ drilldownPath: currentPath.slice(0, -1) });
    },

    whatIfParams: {
        budgetMultiplier: 1,
        conversionMultiplier: 1,
    },
    setWhatIfParams: (params) => set((state) => ({
        whatIfParams: { ...state.whatIfParams, ...params },
    })),

    resetFilters: () => set({
        dateRange: undefined,
        selectedManagers: [],
        selectedCategories: [],
        drilldownPath: [],
    }),
}));