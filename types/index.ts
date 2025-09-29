export interface RawEvent {
    id: string;
    timestamp: string;
    campaign_id: string;
    campaign_name: string;
    channel_id: string;
    channel_name: string;
    project_id: string;
    project_name: string;
    manager: string;
    category: string;
    impressions: number;
    clicks: number;
    spend: number;
    leads: number;
    purchases: number;
    revenue: number;
}

export interface CalculatedMetrics {
    roas: number;
    ctr: number;
    cpl: number;
    cpc: number;
    cac: number;
    lead_to_purchase_cr: number;
}

export interface AggregatedData extends CalculatedMetrics {
    id: string;
    name: string;
    impressions: number;
    clicks: number;
    spend: number;
    leads: number;
    purchases: number;
    revenue: number;
}

export type AggregationLevel = "campaign" | "channel" | "project";

export type DrilldownPath = {
    id: string;
    name: string;
    level: AggregationLevel;
}[];