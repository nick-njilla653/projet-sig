// src/types/electoral-map.types.ts
import { Feature, Geometry } from 'geojson';

export interface ElectoralMapProps {
    viewType: 'general' | 'participation' | 'results';
    level: 'region' | 'department' | 'district';
    onRegionSelect?: (region: string) => void;
    selectedRegion?: string;
    theme?: 'light' | 'dark';
    showControls?: boolean;
    initialCenter?: [number, number];
    initialZoom?: number;
    onDataLoad?: (data: any) => void;
    onError?: (error: Error) => void;
}

export interface ElectoralFeatureProperties {
    id: string;
    name: string;
    totalVoters: number;
    participation: number;
    results?: Array<{
        partyId: string;
        partyName: string;
        votes: number;
        percentage: number;
    }>;
}

export type ElectoralFeature = Feature<Geometry, ElectoralFeatureProperties>;

export interface ElectoralGeoJSON {
    type: 'FeatureCollection';
    features: ElectoralFeature[];
}


export interface RegionStats {
    id: string;
    name: string;
    totalVoters: number;
    averageParticipation: number;
    votingStations: number;
    participationTrend?: {
        hour: string;
        participation: number;
    }[];
    partyDistribution?: PartyResult[];
}

export interface PartyResult {
    partyId: string;
    partyName: string;
    votes: number;
    percentage: number;
    color: string;
    trend?: number;
}

export interface ParticipationTrend {
    hour: string;
    participation: number;
    cumulative: number;
}

export interface SearchResult {
    id: string;
    name: string;
    type: 'region' | 'department' | 'district';
    coordinates: [number, number];
    totalVoters?: number;
}

export interface MapStyle {
    fillColor: string;
    weight: number;
    opacity: number;
    color: string;
    dashArray: string;
    fillOpacity: number;
}

export interface LegendItem {
    color: string;
    label: string;
    value?: number | string;
}

export interface ElectoralMapRef {
    zoomToRegion: (regionId: string) => void;
    refreshData: () => Promise<void>;
    getCurrentView: () => {
        center: [number, number];
        zoom: number;
        bounds: [[number, number], [number, number]];
    };
    exportMapImage: () => Promise<Blob>;
}