import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import {
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonIcon,
  IonButton,
  IonBadge,
  IonChip,
  IonList,
  IonItem,
  IonBreadcrumbs,
  IonBreadcrumb,
} from '@ionic/react';
import {
  map,
  statsChart,
  peopleCircle,
  informationCircle,
  arrowBack,
  layersOutline,
  alertCircle,
} from 'ionicons/icons';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ElectoralMapService, { ElectionData, GeoJsonData } from './ElectoralMapService';
import {
  getParticipationColor,
  getResultsColor,
  calculateBounds,
  formatNumber,
  calculateParticipationStats,
} from './mapUtils';



// Import des types et interfaces
import {
  ElectoralMapProps,
  ElectoralMapRef,
  ElectoralFeatureProperties,
  RegionStats,
  PartyResult,
  SearchResult,
  MapStyle,
  LegendItem
} from './electoral-map.types';
import { ElectoralFeature, GeoJsonFeature, GeoJsonCollection } from './geo-types';
import { Feature, Geometry } from 'geojson';
import L, { StyleFunction } from 'leaflet';


import {
  EnrichedProperties,
  EnrichedGeoJSON
} from './geo-types';
import GeoDataService from './GeoDataService';

// Import des hooks personnalisés
import { useElectoralMap } from './useElectoralMap';
import { useMapControls } from './useMapControls';

import './ElectoralMap.css';


type LeafletStyleFunction = (feature: Feature<Geometry, ElectoralFeatureProperties> | undefined) => L.PathOptions;


interface Props {
  viewType: 'general' | 'participation' | 'results';
  level: 'region' | 'department' | 'district';
  onRegionSelect?: (region: string) => void;
  selectedRegion?: string;
}


const ElectoralMap = forwardRef<ElectoralMapRef, ElectoralMapProps>((props, ref) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<Feature<Geometry, EnrichedProperties> | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<Array<{ id: string, name: string, level: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [geoData, setGeoData] = useState<EnrichedGeoJSON | null>(null);
  const mapRef = React.useRef<L.Map | null>(null);
  const geoService = GeoDataService.getInstance();

  const {

    error,
    stats,
    searchResults,
    setSearchResults,
    selectedFeature,
    setSelectedFeature,
    handleSearch,
    handleFeatureClick,
    zoomToFeature,
    refreshData
  } = useElectoralMap(props);

  const {
    zoom,
    center,
    bounds,
    handleZoomChange,
    handleCenterChange,
    handleBoundsChange
  } = useMapControls();

  // Exposer les méthodes via la ref
  useImperativeHandle(ref, () => ({
    zoomToRegion: (regionId: string) => {
      const feature = geoData?.features.find(f => f.properties.id === regionId);
      if (feature) {
        zoomToFeature(feature);
      }
    },
    refreshData,
    getCurrentView: () => ({
      center,
      zoom,
      bounds: bounds || [[0, 0], [0, 0]]
    }),
    exportMapImage: async () => {
      if (!mapRef.current) return new Blob();
      // Logique d'export de l'image
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      // ... logique de rendu de la carte sur le canvas
      return new Promise(resolve => {
        canvas.toBlob(blob => {
          resolve(blob || new Blob());
        });
      });
    }
  }));

  const loadGeoData = useCallback(async (level: string, parentId?: string) => {
    setLoading(true);
    try {
      const data = await geoService.getGeoData(
        level as 'region' | 'department' | 'district',
        parentId
      );
      setGeoData(data);
    } catch (error) {
      console.error('Error loading geo data:', error);
    } finally {
      setLoading(false);
    }
  }, []);



  // Fonction onEachFeature pour GeoJSON
  const onEachFeature = useCallback((feature: Feature<Geometry, EnrichedProperties>, layer: L.Layer) => {
    if (!feature.properties) return;

    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          dashArray: '',
          fillOpacity: 0.9,
        });
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        if (feature.properties.id !== selectedArea?.properties.id) {
          const layer = e.target;
          layer.setStyle(getFeatureStyle(feature));
        }
      },
      click: (e: L.LeafletMouseEvent) => {
        handleAreaSelection(feature);
      },
    });
  }, [selectedArea]);


  // Gestionnaire de style pour les features
  const getFeatureStyle: StyleFunction = useCallback((feature?: Feature<Geometry, EnrichedProperties>) => {
    if (!feature?.properties) {
      return {
        fillColor: '#e0e0e0',
        weight: 1,
        opacity: 1,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      };
    }

    const { properties } = feature;
    const isSelected = properties.id === selectedArea?.properties?.id;

    return {
      fillColor: props.viewType === 'participation'
        ? getParticipationColor(properties.participation)
        : props.viewType === 'results'
          ? getResultsColor(properties.results)
          : '#e0e0e0',
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#000' : '#666',
      dashArray: '',
      fillOpacity: 0.7
    };
  }, [props.viewType, selectedArea]);

  const handleAreaSelection = useCallback((feature: Feature<Geometry, EnrichedProperties>) => {
    setSelectedArea(feature);
    setNavigationHistory(prev => [...prev, {
      id: feature.properties.id,
      name: feature.properties.name,
      level: feature.properties.level
    }]);

    if (feature.properties.level !== 'district') {
      const nextLevel = feature.properties.level === 'region' ? 'department' : 'district';
      loadGeoData(nextLevel, feature.properties.id);
    }

    // Zoom sur la zone sélectionnée
    if (mapRef.current && feature.geometry) {
      const bounds = L.geoJSON(feature).getBounds();
      mapRef.current.fitBounds(bounds);
    }
  }, [loadGeoData]);

  const handleNavigationBack = useCallback((index: number) => {
    const newHistory = navigationHistory.slice(0, index + 1);
    setNavigationHistory(newHistory);

    const lastItem = newHistory[newHistory.length - 1];
    if (lastItem) {
      loadGeoData(lastItem.level, lastItem.id);
    } else {
      loadGeoData('region');
    }
  }, [navigationHistory, loadGeoData]);

  // Composant pour contrôler la vue de la carte
  const MapController: React.FC = () => {
    const map = useMap();

    React.useEffect(() => {
      mapRef.current = map;

      const handleViewportChange = () => {
        handleZoomChange(map.getZoom());
        handleCenterChange([map.getCenter().lat, map.getCenter().lng]);
        handleBoundsChange([
          [map.getBounds().getSouth(), map.getBounds().getWest()],
          [map.getBounds().getNorth(), map.getBounds().getEast()]
        ]);
      };

      map.on('zoomend moveend', handleViewportChange);
      return () => {
        map.off('zoomend moveend', handleViewportChange);
      };
    }, [map]);

    return null;
  };
  // Générer les éléments de légende
  const getLegendItems = (): LegendItem[] => {
    switch (props.viewType) {
      case 'participation':
        return [
          { color: getParticipationColor(90), label: '> 80%' },
          { color: getParticipationColor(70), label: '60-80%' },
          { color: getParticipationColor(50), label: '40-60%' },
          { color: getParticipationColor(30), label: '20-40%' },
          { color: getParticipationColor(10), label: '< 20%' }
        ];
      case 'results':
        return stats?.partyDistribution?.map(party => ({
          color: party.color,
          label: party.partyName,
          value: `${party.percentage.toFixed(1)}%`
        })) || [];
      default:
        return [{ color: '#e0e0e0', label: 'Données générales' }];
    }
  };

  if (error) {
    return (
      <IonCard className="error-card">
        <IonCardContent>
          <IonIcon icon={alertCircle} color="danger" />
          <p>Erreur de chargement des données : {error.message}</p>
          <IonButton onClick={refreshData}>Réessayer</IonButton>
        </IonCardContent>
      </IonCard>
    );
  }


  return (
    <div className="electoral-map" data-testid="electoral-map">
      {/* Navigation */}
      <div className="navigation-breadcrumbs">
        <IonBreadcrumbs>
          <IonBreadcrumb onClick={() => handleNavigationBack(-1)}>
            Cameroun
          </IonBreadcrumb>
          {navigationHistory.map((item, index) => (
            <IonBreadcrumb
              key={item.id}
              onClick={() => handleNavigationBack(index)}
            >
              {item.name}
            </IonBreadcrumb>
          ))}
        </IonBreadcrumbs>
      </div>

      {/* Carte */}
      <div className="map-container">
        {loading ? (
          <div className="loading-overlay">
            <IonSpinner name="crescent" />
            <p>Chargement de la carte...</p>
          </div>
        ) : (
          <MapContainer
            center={[7.3697, 12.3547]}
            zoom={6}
            className="map"
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {geoData && (
              <GeoJSON
                key={props.viewType + geoData.name}
                data={geoData}
                style={getFeatureStyle}
                onEachFeature={onEachFeature}
              />
            )}
          </MapContainer>
        )}
      </div>

      {/* Panneau d'informations */}
      {selectedArea && (
        <IonCard className="feature-info">
          <IonCardContent>
            <div className="feature-header">
              <h3>{selectedArea.properties.name}</h3>
              <IonChip color="primary">
                {selectedArea.properties.level}
              </IonChip>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <IonIcon icon={peopleCircle} />
                <span>Électeurs inscrits</span>
                <strong>{selectedArea.properties.totalVoters.toLocaleString()}</strong>
              </div>
              <div className="stat-item">
                <IonIcon icon={statsChart} />
                <span>Participation</span>
                <strong>{selectedArea.properties.participation.toFixed(1)}%</strong>
              </div>
            </div>

            {props.viewType === 'results' && selectedArea.properties.results && (
              <div className="results-list">
                {selectedArea.properties.results.map(result => (
                  <div key={result.partyId} className="result-item">
                    <span>{result.partyName}</span>
                    <IonBadge color="primary">
                      {result.percentage.toFixed(1)}%
                    </IonBadge>
                    <span className="votes">
                      {result.votes.toLocaleString()} votes
                    </span>
                  </div>
                ))}
              </div>
            )}
          </IonCardContent>
        </IonCard>
      )}



      <div className="map-legend">
        <IonCard>
          <IonCardContent>
            <h4>Légende</h4>
            {props.viewType === 'participation' ? (
              <div className="legend-items">
                <div className="legend-item">
                  <div className="color-box" style={{ backgroundColor: getParticipationColor(90) }} />
                  <span>{'> 80%'}</span>
                </div>
                <div className="legend-item">
                  <div className="color-box" style={{ backgroundColor: getParticipationColor(70) }} />
                  <span>60-80%</span>
                </div>
                <div className="legend-item">
                  <div className="color-box" style={{ backgroundColor: getParticipationColor(50) }} />
                  <span>40-60%</span>
                </div>
                <div className="legend-item">
                  <div className="color-box" style={{ backgroundColor: getParticipationColor(30) }} />
                  <span>20-40%</span>
                </div>
                <div className="legend-item">
                  <div className="color-box" style={{ backgroundColor: getParticipationColor(10) }} />
                  <span>{'< 20%'}</span>
                </div>
              </div>
            ) : props.viewType === 'results' ? (
              <div className="legend-items">
                {/* Légende des partis politiques */}
                <div className="legend-item">
                  <div className="color-box" style={{ backgroundColor: '#2166ac' }} />
                  <span>Parti A en tête</span>
                </div>
                <div className="legend-item">
                  <div className="color-box" style={{ backgroundColor: '#d73027' }} />
                  <span>Parti B en tête</span>
                </div>
                <div className="legend-item">
                  <div className="color-box" style={{ backgroundColor: '#1a9850' }} />
                  <span>Parti C en tête</span>
                </div>
              </div>
            ) : (
              <div className="legend-items">
                <div className="legend-item">
                  <div className="color-box" style={{ backgroundColor: '#e0e0e0' }} />
                  <span>Données générales</span>
                </div>
              </div>
            )}
          </IonCardContent>
        </IonCard>
      </div>

      {stats && (
        <div className="statistics-panel">
          <IonCard>
            <IonCardContent>
              <h4>
                <IonIcon icon={statsChart} />
                Statistiques {props.level === 'region' ? 'régionales' : props.level === 'department' ? 'départementales' : 'locales'}
              </h4>

              <div className="stats-summary">
                <div className="stat-box">
                  <span className="stat-label">Total des inscrits</span>
                  <strong>{formatNumber(stats.totalVoters)}</strong>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Participation moyenne</span>
                  <strong>{stats.averageParticipation.toFixed(1)}%</strong>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Bureaux de vote</span>
                  <strong>{formatNumber(stats.votingStations)}</strong>
                </div>
              </div>

              {stats.participationTrend && (
                <div className="participation-chart">
                  <h5>Évolution de la participation</h5>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={stats.participationTrend}>
                      <XAxis dataKey="hour" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="participation"
                        stroke="#2196f3"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {props.viewType === 'results' && stats?.partyDistribution && (
                <div className="results-distribution">
                  <h5>Distribution des résultats</h5>
                  {stats.partyDistribution.map((party: PartyResult) => (
                    <div key={party.partyId} className="party-result-bar">
                      <div className="party-info">
                        <span>{party.partyName}</span>
                        <strong>{party.percentage.toFixed(1)}%</strong>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress"
                          style={{
                            width: `${party.percentage}%`,
                            backgroundColor: party.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>
      )}
    </div>
  );
});

export default ElectoralMap;