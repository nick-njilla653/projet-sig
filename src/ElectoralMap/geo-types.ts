// src/types/geo-types.ts
import { Feature, Geometry } from 'geojson';

export interface GeoJsonFeatureProperties {
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

export interface GeoJsonFeature extends Feature<Geometry, GeoJsonFeatureProperties> { }

export interface GeoJsonCollection {
    type: 'FeatureCollection';
    features: GeoJsonFeature[];
}

// Définition des propriétés de base pour les features électorales
export interface ElectoralFeatureProperties {
    // Propriétés de base obligatoires
    id: string;
    name: string;
    totalVoters: number;
    participation: number;

    // Propriétés optionnelles pour les résultats
    results?: ElectoralResult[];

    // Permet d'étendre avec d'autres propriétés dynamiques
    [key: string]: any;
}



// Type complet pour une feature électorale
export type ElectoralFeature = Feature<Geometry, ElectoralFeatureProperties>;

// Type pour la collection de features
export interface ElectoralFeatureCollection {
    type: 'FeatureCollection';
    features: ElectoralFeature[];
}

// Types utilitaires pour les différents niveaux administratifs
export interface RegionFeatureProperties extends ElectoralFeatureProperties {
    level: 'region';
    departments: string[]; // IDs des départements
}

export interface DepartmentFeatureProperties extends ElectoralFeatureProperties {
    level: 'department';
    regionId: string;
    districts: string[]; // IDs des districts
}

export interface DistrictFeatureProperties extends ElectoralFeatureProperties {
    level: 'district';
    departmentId: string;
    regionId: string;
    votingCenters: string[]; // IDs des centres de vote
}

// Types spécifiques pour chaque niveau
export type RegionFeature = Feature<Geometry, RegionFeatureProperties>;
export type DepartmentFeature = Feature<Geometry, DepartmentFeatureProperties>;
export type DistrictFeature = Feature<Geometry, DistrictFeatureProperties>;

// Type discriminant pour les features
export type AdminFeature = RegionFeature | DepartmentFeature | DistrictFeature;

// Type guard pour vérifier le niveau administratif
export function isRegionFeature(feature: AdminFeature): feature is RegionFeature {
    return feature.properties.level === 'region';
}

export function isDepartmentFeature(feature: AdminFeature): feature is DepartmentFeature {
    return feature.properties.level === 'department';
}

export function isDistrictFeature(feature: AdminFeature): feature is DistrictFeature {
    return feature.properties.level === 'district';
}

// src/types/geo-types.ts


// Propriétés de base communes
interface BaseProperties {
  GID_0: string;
  COUNTRY: string;
  NL_NAME_1: string;
}

// Propriétés des régions
export interface RegionProperties extends BaseProperties {
  GID_1: string;
  NAME_1: string;
  VARNAME_1: string;
  TYPE_1: string;
  ENGTYPE_1: string;
  CC_1: string;
  HASC_1: string;
  ISO_1: string;
}

// Propriétés des départements
export interface DepartmentProperties extends BaseProperties {
  GID_2: string;
  GID_1: string;
  NAME_1: string;
  NAME_2: string;
  VARNAME_2: string;
  TYPE_2: string;
  ENGTYPE_2: string;
  CC_2: string;
  HASC_2: string;
}

// Propriétés des arrondissements
export interface DistrictProperties extends BaseProperties {
  GID_3: string;
  GID_2: string;
  GID_1: string;
  NAME_1: string;
  NAME_2: string;
  NAME_3: string;
  VARNAME_3: string;
  TYPE_3: string;
  ENGTYPE_3: string;
  CC_3: string;
}

export interface CRS {
  type: "name";
  properties: {
    name: string;
  };
}

export interface CameroonFeature<T> {
  type: "Feature";
  properties: T;
  geometry: Geometry;
}

export interface CameroonGeoJSON<T> {
  type: "FeatureCollection";
  name: string;
  crs: CRS;
  features: CameroonFeature<T>[];
}

export interface ElectoralResult {
  partyId: string;
  partyName: string;
  votes: number;
  percentage: number;
}

// Types enrichis avec données électorales
export interface EnrichedProperties {
  id: string;
  name: string;
  level: 'region' | 'department' | 'district';
  parentId?: string;
  parentName?: string;
  totalVoters: number;
  participation: number;
  results: ElectoralResult[];
}

export interface EnrichedFeature extends CameroonFeature<EnrichedProperties> {}

export interface EnrichedGeoJSON extends CameroonGeoJSON<EnrichedProperties> {}