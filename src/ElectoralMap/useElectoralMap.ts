// src/hooks/useElectoralMap.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { Map as LeafletMap } from 'leaflet';
import ElectoralMapService from './ElectoralMapService';
import { ElectoralMapProps, RegionStats, SearchResult } from './electoral-map.types';
import { calculateBounds } from './mapUtils';
import { Feature, Geometry, GeoJSON } from 'geojson';
import { GeoJsonFeature, GeoJsonCollection } from './geo-types';
import { calculateFeatureBounds } from './geo-utils';
import { ElectoralFeature, ElectoralFeatureProperties, ElectoralFeatureCollection, AdminFeature, isRegionFeature } from './geo-types';
import GeoDataService from './GeoDataService';

export interface UseElectoralMapReturn {
    loading: boolean;
    error: Error | null;
    geoData: GeoJsonCollection | null;
    stats: RegionStats | null;
    searchResults: SearchResult[];
    setSearchResults: (results: SearchResult[]) => void;
    selectedFeature: GeoJsonFeature | null;
    setSelectedFeature: (feature: GeoJsonFeature | null) => void;
    mapRef: React.MutableRefObject<LeafletMap | null>;
    handleSearch: (query: string) => Promise<void>;
    handleFeatureClick: (feature: GeoJsonFeature) => void;
    zoomToFeature: (feature: GeoJsonFeature) => void;
    refreshData: () => Promise<void>;
}

export const useElectoralMap = (props: ElectoralMapProps): UseElectoralMapReturn => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [geoData, setGeoData] = useState<ElectoralFeatureCollection | null>(null);
    const [stats, setStats] = useState<RegionStats | null>(null);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [selectedFeature, setSelectedFeature] = useState<ElectoralFeature | null>(null);
    const mapRef = useRef<LeafletMap | null>(null);
    const geoDataService = GeoDataService.getInstance();

    const mapService = ElectoralMapService.getInstance();

    const loadMapData = useCallback(async () => {
        try {
          setLoading(true);
          const geoData = await geoDataService.getGeoData(props.level);
          setGeoData(geoData);
          
          // Chargez les statistiques associées si nécessaire
        } catch (error) {
          setError(error as Error);
        } finally {
          setLoading(false);
        }
      }, [props.level]);

    const handleSearch = async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            const results = await mapService.searchLocation(query);
            setSearchResults(results);
        } catch (err) {
            console.error('Search failed:', err);
            setSearchResults([]);
        }
    };

    const zoomToFeature = useCallback((feature: ElectoralFeature) => {
        if (!mapRef.current) {
            console.warn('Référence de carte non disponible');
            return;
        }

        const bounds = calculateFeatureBounds(feature);
        if (!bounds) {
            console.warn('Impossible de calculer les limites de la feature');
            return;
        }

        mapRef.current.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 12
        });
    }, []);

    const handleFeatureClick = useCallback((feature: ElectoralFeature) => {
        if (!feature.properties) {
            console.warn('Feature sans propriétés');
            return;
        }

        setSelectedFeature(feature);
        props.onRegionSelect?.(feature.properties.id);

        const bounds = calculateFeatureBounds(feature);
        if (bounds && mapRef.current) {
            mapRef.current.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 12
            });
        }
    }, [props.onRegionSelect]);

    useEffect(() => {
        loadMapData();
    }, [loadMapData]);

    useEffect(() => {
        if (props.selectedRegion && geoData) {
            const feature = geoData.features.find(
                f => f.properties?.id === props.selectedRegion
            );
            if (feature) {
                setSelectedFeature(feature);
                zoomToFeature(feature);
            }
        }
    }, [props.selectedRegion, geoData, zoomToFeature]);

    return {
        loading,
        error,
        geoData,
        stats,
        searchResults,
        setSearchResults,
        selectedFeature,
        setSelectedFeature,
        mapRef,
        handleSearch,
        handleFeatureClick,
        zoomToFeature,
        refreshData: loadMapData
    };
};