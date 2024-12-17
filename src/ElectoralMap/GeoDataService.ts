// src/services/GeoDataService.ts

import { regionsData } from '../GeoLocalisation/gadm41_CMR_1';
import { departmentsData }from '../GeoLocalisation/gadm41_CMR_2';
import {districtsData} from '../GeoLocalisation/gadm41_CMR_3';
import {
  CameroonGeoJSON,
  RegionProperties,
  DepartmentProperties,
  DistrictProperties,
  EnrichedGeoJSON,
  EnrichedProperties,
  CameroonFeature
} from './geo-types';

class GeoDataService {
  private static instance: GeoDataService;
  private regionsGeoJSON: CameroonGeoJSON<RegionProperties>;
  private departmentsGeoJSON: CameroonGeoJSON<DepartmentProperties>;
  private districtsGeoJSON: CameroonGeoJSON<DistrictProperties>;

  private constructor() {
    this.regionsGeoJSON = regionsData as CameroonGeoJSON<RegionProperties>;
    this.departmentsGeoJSON = departmentsData as CameroonGeoJSON<DepartmentProperties>;
    this.districtsGeoJSON = districtsData as CameroonGeoJSON<DistrictProperties>;
  }

  public static getInstance(): GeoDataService {
    if (!GeoDataService.instance) {
      GeoDataService.instance = new GeoDataService();
    }
    return GeoDataService.instance;
  }

  public async getGeoData(
    level: 'region' | 'department' | 'district',
    parentId?: string
  ): Promise<EnrichedGeoJSON> {
    switch (level) {
      case 'region':
        return this.enrichRegionsData();
      case 'department':
        return this.enrichDepartmentsData(parentId);
      case 'district':
        return this.enrichDistrictsData(parentId);
      default:
        throw new Error('Invalid geographic level');
    }
  }

  private enrichRegionsData(): EnrichedGeoJSON {
    return {
      type: "FeatureCollection",
      name: this.regionsGeoJSON.name,
      crs: this.regionsGeoJSON.crs,
      features: this.regionsGeoJSON.features.map(feature => ({
        type: "Feature",
        geometry: feature.geometry,
        properties: {
          id: feature.properties.GID_1,
          name: feature.properties.NAME_1,
          level: 'region',
          totalVoters: 10000 + Math.floor(Math.random() * 90000),
          participation: Math.random() * 100,
          results: this.generateMockResults()
        }
      }))
    };
  }

  private enrichDepartmentsData(regionId?: string): EnrichedGeoJSON {
    let features = this.departmentsGeoJSON.features;
    if (regionId) {
      features = features.filter(f => f.properties.GID_1 === regionId);
    }

    return {
      type: "FeatureCollection",
      name: this.departmentsGeoJSON.name,
      crs: this.departmentsGeoJSON.crs,
      features: features.map(feature => ({
        type: "Feature",
        geometry: feature.geometry,
        properties: {
          id: feature.properties.GID_2,
          name: feature.properties.NAME_2,
          level: 'department',
          parentId: feature.properties.GID_1,
          parentName: feature.properties.NAME_1,
          totalVoters: 5000 + Math.floor(Math.random() * 45000),
          participation: Math.random() * 100,
          results: this.generateMockResults()
        }
      }))
    };
  }

  private enrichDistrictsData(departmentId?: string): EnrichedGeoJSON {
    let features = this.districtsGeoJSON.features;
    if (departmentId) {
      features = features.filter(f => f.properties.GID_2 === departmentId);
    }

    return {
      type: "FeatureCollection",
      name: this.districtsGeoJSON.name,
      crs: this.districtsGeoJSON.crs,
      features: features.map(feature => ({
        type: "Feature",
        geometry: feature.geometry,
        properties: {
          id: feature.properties.GID_3,
          name: feature.properties.NAME_3,
          level: 'district',
          parentId: feature.properties.GID_2,
          parentName: feature.properties.NAME_2,
          totalVoters: 1000 + Math.floor(Math.random() * 9000),
          participation: Math.random() * 100,
          results: this.generateMockResults()
        }
      }))
    };
  }

  private generateMockResults() {
    return [
      {
        partyId: 'party1',
        partyName: 'Parti A',
        votes: Math.floor(Math.random() * 10000),
        percentage: 45
      },
      {
        partyId: 'party2',
        partyName: 'Parti B',
        votes: Math.floor(Math.random() * 8000),
        percentage: 35
      }
    ];
  }

  // Méthodes de recherche et d'accès aux données
  public getRegionByName(name: string) {
    return this.regionsGeoJSON.features.find(
      f => f.properties.NAME_1.toLowerCase() === name.toLowerCase()
    );
  }

  public getDepartmentByName(name: string) {
    return this.departmentsGeoJSON.features.find(
      f => f.properties.NAME_2.toLowerCase() === name.toLowerCase()
    );
  }

  public getDistrictByName(name: string) {
    return this.districtsGeoJSON.features.find(
      f => f.properties.NAME_3.toLowerCase() === name.toLowerCase()
    );
  }

  public getDepartmentsByRegion(regionId: string) {
    return this.departmentsGeoJSON.features.filter(
      f => f.properties.GID_1 === regionId
    );
  }

  public getDistrictsByDepartment(departmentId: string) {
    return this.districtsGeoJSON.features.filter(
      f => f.properties.GID_2 === departmentId
    );
  }

  public searchByQuery(query: string, level: 'region' | 'department' | 'district') {
    const lowercaseQuery = query.toLowerCase();
    
    switch(level) {
      case 'region':
        return this.regionsGeoJSON.features.filter(f => 
          f.properties.NAME_1.toLowerCase().includes(lowercaseQuery) ||
          f.properties.VARNAME_1.toLowerCase().includes(lowercaseQuery)
        );
      
      case 'department':
        return this.departmentsGeoJSON.features.filter(f =>
          f.properties.NAME_2.toLowerCase().includes(lowercaseQuery) ||
          (f.properties.VARNAME_2 || '').toLowerCase().includes(lowercaseQuery)
        );
      
      case 'district':
        return this.districtsGeoJSON.features.filter(f =>
          f.properties.NAME_3.toLowerCase().includes(lowercaseQuery) ||
          (f.properties.VARNAME_3 || '').toLowerCase().includes(lowercaseQuery)
        );
    }
  }
}

export default GeoDataService;