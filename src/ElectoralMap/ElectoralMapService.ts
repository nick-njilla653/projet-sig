import { GeoData, ElectoralMap, LocationStats, VotingCenter, LocationLevel, CandidateResult, ElectoralStatistics, GeoFeature } from './Electoral';
import regionsData from '../GeoLocalisation/gadm41_CMR_1.json';
import departmentsData from '../GeoLocalisation/gadm41_CMR_2.json';
import districtsData from '../GeoLocalisation/gadm41_CMR_3.json';

export class ElectoralMapService {

    private electoralData: ElectoralMap;
    private geoData: {
        regions: GeoData;
        departments: GeoData;
        districts: GeoData;
    };

    constructor() {
        this.geoData = {
            regions: regionsData as GeoData,
            departments: departmentsData as GeoData,
            districts: districtsData as GeoData
        };
        this.electoralData = this.initializeElectoralData();
    }

    public getGeoData(level: LocationLevel): GeoData {
        switch (level) {
            case 'region':
                return this.geoData.regions;
            case 'department':
                return this.geoData.departments;
            case 'district':
                return this.geoData.districts;
            default:
                throw new Error(`Invalid level: ${level}`);
        }
    }

    private initializeElectoralData(): ElectoralMap {
        const electoralMap: ElectoralMap = {
            national: this.createNationalStats(),
            regions: new Map(),
            departments: new Map(),
            districts: new Map(),
            votingCenters: new Map()
        };

        // Traiter les régions
        this.geoData.regions.features.forEach(feature => {
            const regionId = feature.properties.GID_1;
            if (regionId) {
                electoralMap.regions.set(regionId, this.createLocationStats(feature, 'region'));
            }
        });

        // Traiter les départements
        this.geoData.departments.features.forEach(feature => {
            const deptId = feature.properties.GID_2;
            const regionId = feature.properties.GID_1;
            if (deptId) {
                electoralMap.departments.set(deptId, this.createLocationStats(feature, 'department', regionId));
            }
        });

        // Traiter les arrondissements
        this.geoData.districts.features.forEach(feature => {
            const districtId = feature.properties.GID_3;
            const deptId = feature.properties.GID_2;
            if (districtId) {
                electoralMap.districts.set(districtId, this.createLocationStats(feature, 'district', deptId));
                electoralMap.votingCenters.set(districtId, this.createVotingCenter(feature));
            }
        });

        return electoralMap;
    }

    private createNationalStats(): LocationStats {
        return {
            id: 'CMR',
            name: 'Cameroun',
            level: 'national',
            registeredVoters: 0,
            votingCenters: 0,
            candidates: this.generateMockCandidates()
        };
    }

    private createLocationStats(
        feature: GeoFeature,
        level: LocationLevel,
        parentId?: string
    ): LocationStats {
        const getId = (): string => {
            switch (level) {
                case 'region': return feature.properties.GID_1 || '';
                case 'department': return feature.properties.GID_2 || '';
                case 'district': return feature.properties.GID_3 || '';
                default: return '';
            }
        };

        const getName = (): string => {
            switch (level) {
                case 'region': return feature.properties.NAME_1 || '';
                case 'department': return feature.properties.NAME_2 || '';
                case 'district': return feature.properties.NAME_3 || '';
                default: return '';
            }
        };

        return {
            id: getId(),
            name: getName(),
            level,
            parentId,
            registeredVoters: this.generateRandomStats(),
            votingCenters: level === 'district' ? 1 : 0,
            candidates: this.generateMockCandidates()
        };
    }

    private createVotingCenter(feature: GeoFeature): VotingCenter {
        let coordinates: [number, number] = [0, 0];

        try {
            if (feature.geometry.type === 'Polygon') {
                coordinates = this.calculateCentroid(feature.geometry.coordinates as number[][][]);
            } else if (feature.geometry.type === 'MultiPolygon') {
                coordinates = this.calculateCentroid(feature.geometry.coordinates[0] as number[][][]);
            }
        } catch (error) {
            console.error('Erreur lors du calcul du centroïde:', error);
        }

        return {
            id: feature.properties.GID_3 || '',
            name: `Bureau de vote ${feature.properties.NAME_3 || ''}`,
            location: {
                lat: coordinates[1],
                lng: coordinates[0]
            },
            districtId: feature.properties.GID_3 || '',
            registeredVoters: this.generateRandomStats()
        };
    }


    private calculateCentroid(coordinates: number[][][]): [number, number] {
        let xSum = 0, ySum = 0;
        let pointCount = 0;

        // Aplatir le premier niveau de coordonnées pour les polygones
        const flatCoords = coordinates[0];

        flatCoords.forEach(point => {
            xSum += point[0];
            ySum += point[1];
            pointCount++;
        });

        return [
            pointCount > 0 ? xSum / pointCount : 0,
            pointCount > 0 ? ySum / pointCount : 0
        ];
    }

    private generateRandomStats(): number {
        return Math.floor(Math.random() * 5000) + 1000;
    }

    private generateMockCandidates(): CandidateResult[] {
        return [
            {
                candidateId: '1',
                candidateName: 'Candidat A',
                party: 'Parti A',
                votes: this.generateRandomStats(),
                percentage: 0
            },
            {
                candidateId: '2',
                candidateName: 'Candidat B',
                party: 'Parti B',
                votes: this.generateRandomStats(),
                percentage: 0
            }
        ];
    }

    public searchLocations(query: string): Array<{ id: string; name: string }> {
        const results: Array<{ id: string; name: string }> = [];

        // Recherche dans les régions
        this.geoData.regions.features.forEach(feature => {
            const name = feature.properties.NAME_1;
            const id = feature.properties.GID_1;
            if (name && id && name.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    id,
                    name: `${name} (Région)`
                });
            }
        });

        // Recherche dans les départements
        this.geoData.departments.features.forEach(feature => {
            const name = feature.properties.NAME_2;
            const id = feature.properties.GID_2;
            if (name && id && name.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    id,
                    name: `${name} (Département)`
                });
            }
        });

        // Recherche dans les arrondissements
        this.geoData.districts.features.forEach(feature => {
            const name = feature.properties.NAME_3;
            const id = feature.properties.GID_3;
            if (name && id && name.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    id,
                    name: `${name} (Arrondissement)`
                });
            }
        });

        return results;
    }

    public getElectoralStatistics(): ElectoralStatistics {
        return {
            totalVoters: this.calculateTotalVoters(),
            totalParticipation: this.calculateTotalParticipation(),
            voterDistribution: this.calculateVoterDistribution(),
            participationTrend: this.calculateParticipationTrend()
        };
    }

    private calculateTotalVoters(): number {
        let total = 0;
        this.electoralData.regions.forEach(region => {
            total += region.registeredVoters;
        });
        return total;
    }

    private calculateTotalParticipation(): number {
        // Simulation d'un taux de participation
        return Math.floor(Math.random() * 30) + 50; // Entre 50% et 80%
    }

    private calculateVoterDistribution(): Array<{ region: string; count: number; percentage: number }> {
        const totalVoters = this.calculateTotalVoters();
        const distribution: Array<{ region: string; count: number; percentage: number }> = [];

        this.electoralData.regions.forEach((stats, regionId) => {
            distribution.push({
                region: stats.name,
                count: stats.registeredVoters,
                percentage: (stats.registeredVoters / totalVoters) * 100
            });
        });

        return distribution;
    }

    private calculateParticipationTrend(): Array<{ time: string; participation: number }> {
        // Simulation de données de tendance
        return Array.from({ length: 12 }, (_, i) => ({
            time: `${i + 1}h`,
            participation: Math.floor(Math.random() * 30) + 50
        }));
    }

    // Getters
    public getRegionsGeoData(): GeoData {
        return this.geoData.regions;
    }

    public getDepartmentsGeoData(): GeoData {
        return this.geoData.departments;
    }

    public getDistrictsGeoData(): GeoData {
        return this.geoData.districts;
    }

    public getAllData(): ElectoralMap {
        return this.electoralData;
    }

    public getLocationStats(id: string): LocationStats | undefined {
        return (
            this.electoralData.regions.get(id) ||
            this.electoralData.departments.get(id) ||
            this.electoralData.districts.get(id)
        );
    }

    public getVotingCenter(id: string): VotingCenter | undefined {
        return this.electoralData.votingCenters.get(id);
    }
}