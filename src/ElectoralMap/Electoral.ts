import { MapContainer, TileLayer, GeoJSON as ReactGeoJSON, useMap } from 'react-leaflet';
import L, { GeoJSON, Layer, LeafletMouseEvent } from 'leaflet';
import { Feature, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';


// Types de base pour les données géographiques
interface GeoFeatureGeometry {
  type: string;
  coordinates: number[][][][] | number[][][];
}

interface GeoFeatureProperties {
  GID_0?: string;
  GID_1?: string;
  GID_2?: string;
  GID_3?: string;
  COUNTRY?: string;
  NAME_1?: string;
  NAME_2?: string;
  NAME_3?: string;
  TYPE_1?: string;
  TYPE_2?: string;
  TYPE_3?: string;
  [key: string]: any;
}

interface GeoFeature {
  type: 'Feature';
  properties: GeoFeatureProperties;
  geometry: GeoFeatureGeometry;
}

interface GeoData {
  type: string;
  name: string;
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  features: GeoFeature[];
}

// Interfaces pour les données électorales
interface ElectoralStats {
  registeredVoters: number;
  votingCenters: number;
  participation?: number;
  invalidVotes?: number;
}

interface CandidateResult {
  candidateId: string;
  candidateName: string;
  party: string;
  votes: number;
  percentage: number;
}

type LocationLevel = 'national' | 'region' | 'department' | 'district';

interface LocationStats extends ElectoralStats {
  id: string;
  name: string;
  level: LocationLevel;
  parentId?: string;
  candidates: CandidateResult[];
  color?: string;
}

interface VotingCenter {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  districtId: string;
  registeredVoters: number;
  results?: CandidateResult[];
}

interface ElectoralMap {
  national: LocationStats;
  regions: Map<string, LocationStats>;
  departments: Map<string, LocationStats>;
  districts: Map<string, LocationStats>;
  votingCenters: Map<string, VotingCenter>;
}

interface ElectoralStatistics {
  totalVoters: number;
  totalParticipation: number;
  voterDistribution: Array<{
    region: string;
    count: number;
    percentage: number;
  }>;
  participationTrend: Array<{
    time: string;
    participation: number;
  }>;
}

// Types pour Leaflet
interface GeoJsonFeature extends GeoJSON.Feature {
  properties: {
    GID_1?: string;
    GID_2?: string;
    GID_3?: string;
    NAME_1?: string;
    NAME_2?: string;
    NAME_3?: string;
    [key: string]: any;
  };
}

// Types pour la geometrie

type CustomGeometry = {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
};

type CustomFeature = {
  type: "Feature";
  properties: GeoFeatureProperties;
  geometry: CustomGeometry;
};

type CustomFeatureCollection = {
  type: "FeatureCollection";
  features: CustomFeature[];
};

type StyleFunctionType = (feature: Feature<Geometry, GeoJsonProperties>) => L.PathOptions;

// Export all interfaces
export type {
  CustomGeometry,
  CustomFeature,
  CustomFeatureCollection,
  GeoJsonProperties,
  GeoFeatureGeometry,
  GeoFeatureProperties,
  GeoFeature,
  GeoData,
  ElectoralStats,
  CandidateResult,
  LocationLevel,
  LocationStats,
  VotingCenter,
  ElectoralMap,
  ElectoralStatistics,
  GeoJsonFeature,
  StyleFunctionType
};