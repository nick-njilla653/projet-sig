// src/services/ElectoralMapService.ts
import { Feature, FeatureCollection, Geometry } from 'geojson';
import { ElectoralFeatureCollection } from './geo-types';
export interface ElectionData {
    id: string;
    name: string;
    level: 'region' | 'department' | 'district';
    totalVoters: number;
    participation: number;
    results: Array<{
        partyId: string;
        partyName: string;
        votes: number;
        percentage: number;
      }>;
}

export interface GeoJsonData {
    type: "FeatureCollection";
    features: Array<Feature<Geometry, ElectionData>>;
  }

class ElectoralMapService {
    private static instance: ElectoralMapService;
    private cachedData: { [key: string]: GeoJsonData } = {};

    private constructor() { }

    public static getInstance(): ElectoralMapService {
        if (!ElectoralMapService.instance) {
            ElectoralMapService.instance = new ElectoralMapService();
        }
        return ElectoralMapService.instance;
    }

    public async getGeoData(level: string): Promise<ElectoralFeatureCollection> {
        if (this.cachedData[level]) {
            return this.cachedData[level];
        }

        try {
            const response = await fetch(`/api/geodata/${level}`);
            const data = await response.json();
            this.cachedData[level] = data;
            return data;
        } catch (error) {
            console.error('Error fetching geo data:', error);
            throw error;
        }
    }

    public async getElectionStats(level: string, regionId?: string): Promise<any> {
        try {
            const params = regionId ? `?regionId=${regionId}` : '';
            const response = await fetch(`/api/election-stats/${level}${params}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching election stats:', error);
            throw error;
        }
    }

    public async searchLocation(query: string): Promise<any[]> {
        try {
            const response = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`);
            return await response.json();
        } catch (error) {
            console.error('Error searching locations:', error);
            throw error;
        }
    }
}

export default ElectoralMapService;