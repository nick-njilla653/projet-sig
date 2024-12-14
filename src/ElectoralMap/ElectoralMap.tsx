import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import {
  layers,
  statsChart,
  informationCircle,
  closeOutline,
  searchOutline
} from 'ionicons/icons';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import L from 'leaflet';
import { MapContainer, TileLayer, GeoJSON as ReactGeoJSON, useMap } from 'react-leaflet';
import { GeoJSON, Layer, LeafletMouseEvent } from 'leaflet';
import { Feature, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import 'leaflet/dist/leaflet.css';
import { ElectoralMapService } from './ElectoralMapService';
import {
  CustomGeometry,
  CustomFeature,
  CustomFeatureCollection,
  GeoFeatureGeometry,
  GeoFeatureProperties,
  GeoFeature,
  GeoData,
  ElectoralStats,
  CandidateResult,
  LocationLevel,
  LocationStats,
  VotingCenter,
  ElectoralStatistics,
  GeoJsonFeature,
  StyleFunctionType
} from './Electoral';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';




let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


interface ElectoralMapProps {
  viewType: 'general' | 'participation' | 'results';
  level: 'region' | 'department' | 'district';
  selectedRegion?: string;
  onRegionSelect: (regionId: string) => void;
  onViewChange?: (view: 'general' | 'participation' | 'results') => void;
  onLevelChange?: (level: 'region' | 'department' | 'district') => void;
}



interface DistributionItem {
  region: string;
  count: number;
  percentage: number;
}

interface LegendItem {
  color: string;
  label: string;
}



interface MapControlProps {
  title: string;
  options: {
    value: string;
    label: string;
    icon?: string;
  }[];
  value: string;
  onChange: (value: string) => void;
}

const ElectoralMap: React.FC<ElectoralMapProps> = ({
  viewType,
  level,
  selectedRegion,
  onRegionSelect,
  onViewChange,
  onLevelChange
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [geoLayer, setGeoLayer] = useState<L.GeoJSON | null>(null);
  const [activeLevel, setActiveLevel] = useState<'region' | 'department' | 'district'>('region');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<'general' | 'participation' | 'results'>('general');
  const mapService = new ElectoralMapService();


  // Fonction helper pour convertir GeoData en FeatureCollection
  const convertGeoDataToFeatureCollection = (geoData: GeoData): CustomFeatureCollection => {
    return {
      type: 'FeatureCollection',
      features: geoData.features.map(feature => ({
        type: 'Feature',
        properties: feature.properties,
        geometry: {
          type: feature.geometry.type as "Polygon" | "MultiPolygon",
          coordinates: feature.geometry.coordinates
        }
      }))
    };
  };

  


  const getParticipationColor = (participation: number): string => {
    switch (true) {
      case participation > 75:
        return '#2ecc71';
      case participation > 50:
        return '#f1c40f';
      case participation > 25:
        return '#e67e22';
      default:
        return '#e74c3c';
    }
  };

  const getResultsColor = (stats: LocationStats | undefined): string => {
    if (!stats?.candidates?.length) return '#cccccc';

    const leadingCandidate = stats.candidates.reduce((prev, current) =>
      (prev.percentage > current.percentage ? prev : current), stats.candidates[0]
    );

    const candidateColors: { [key: string]: string } = {
      'Parti A': '#3498db',
      'Parti B': '#e74c3c',
    };

    return candidateColors[leadingCandidate.party] || '#95a5a6';
  };

  const getFeatureStyle = (feature: Feature<Geometry, GeoJsonProperties>): L.PathOptions => {
    if (!feature?.properties) {
      return defaultStyle;
    }

    const stats = mapService.getLocationStats(
      feature.properties[`GID_${activeLevel === 'region' ? '1' : activeLevel === 'department' ? '2' : '3'}`]
    );

    return {
      fillColor: activeLayer === 'participation'
        ? getParticipationColor(stats?.participation || 0)
        : activeLayer === 'results'
          ? getResultsColor(stats)
          : stats?.color || '#cccccc',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const defaultStyle: L.PathOptions = {
    fillColor: '#cccccc',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };



  const highlightFeature = (e: LeafletMouseEvent) => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });
  };

  const resetHighlight = (e: LeafletMouseEvent) => {
    if (geoLayer) {
      geoLayer.resetStyle(e.target);
    }
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const l = e.target;
        l.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
        });
      },
      mouseout: (e: LeafletMouseEvent) => {
        const l = e.target;
        l.setStyle(getFeatureStyle(feature as Feature));
      },
      click: (e: LeafletMouseEvent) => {
        const id = feature.properties?.[`GID_${activeLevel === 'region' ? '1' : activeLevel === 'department' ? '2' : '3'}`];
        if (id) {
          setSelectedLocation(id);
          onRegionSelect(id);
          const map = e.target._map;
          if (map) {
            map.fitBounds(e.target.getBounds());
          }
        }
      }
    });

    const name = feature.properties?.[`NAME_${activeLevel === 'region' ? '1' : activeLevel === 'department' ? '2' : '3'}`];
    if (name) layer.bindPopup(name);
  };

  const getLegendItems = (): LegendItem[] => {
    switch (viewType) {
      case 'participation':
        return [
          { color: '#2ecc71', label: 'Très forte (>75%)' },
          { color: '#f1c40f', label: 'Forte (50-75%)' },
          { color: '#e67e22', label: 'Faible (25-50%)' },
          { color: '#e74c3c', label: 'Très faible (<25%)' }
        ];
      case 'results':
        return [
          { color: '#3498db', label: 'Parti A en tête' },
          { color: '#e74c3c', label: 'Parti B en tête' },
          { color: '#95a5a6', label: 'Données non disponibles' }
        ];
      default:
        return [
          { color: '#3498db', label: 'Région' },
          { color: '#2ecc71', label: 'Département' },
          { color: '#e74c3c', label: 'Arrondissement' }
        ];
    }
  };

  const MapController: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      // Mise à jour de la vue quand le niveau ou la couche change
      const geoData = mapService.getGeoData(activeLevel);
      const bounds = L.geoJSON(convertGeoDataToFeatureCollection(geoData)).getBounds();
      map.fitBounds(bounds);
    }, [activeLevel, activeLayer]);

    return null;
  };



  const StatisticsPanel: React.FC = () => {
    const stats = mapService.getElectoralStatistics();

    return (
      <IonCard className="statistics-panel">
        <IonCardContent>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>Total Électeurs</h3>
              <p>{stats.totalVoters.toLocaleString()}</p>
            </div>
            <div className="stat-item">
              <h3>Participation</h3>
              <p>{stats.totalParticipation}%</p>
            </div>
          </div>

          <div className="distribution-chart">
            <h3>Distribution par région</h3>
            <div className="chart-container">
              {stats.voterDistribution.map((item: DistributionItem) => (
                <div key={item.region} className="chart-bar">
                  <div
                    className="bar"
                    style={{ height: `${item.percentage}%` }}
                    title={`${item.region}: ${item.count.toLocaleString()} électeurs`}
                  />
                  <span className="label">{item.region}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="trend-chart">
            <h3>Tendance de participation</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.participationTrend}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="participation" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </IonCardContent>
      </IonCard>
    );
  };

  const SearchControl: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string }>>([]);

    const handleSearch = (query: string) => {
      setSearchQuery(query);
      if (query.length > 2) {
        const results = mapService.searchLocations(query);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };

    const handleResultClick = (locationId: string) => {
      setSelectedLocation(locationId);
      const location = mapService.getLocationStats(locationId);
      if (location && map && geoLayer) {
        // Trouver et zoomer sur la feature correspondante
        geoLayer.eachLayer((layer: any) => {
          if (layer.feature.properties[`GID_${activeLevel === 'region' ? '1' : activeLevel === 'department' ? '2' : '3'}`] === locationId) {
            map.fitBounds(layer.getBounds());
            layer.openPopup();
          }
        });
      }
    };

    return (
      <div className="search-control">
        <input
          type="text"
          placeholder="Rechercher une localité..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(result => (
              <div
                key={result.id}
                className="search-result-item"
                onClick={() => handleResultClick(result.id)}
              >
                {result.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (map && selectedLocation && geoLayer) {
      // Ajouter une animation de pulsation sur la localité sélectionnée
      geoLayer?.eachLayer((layer: any) => {
        if (layer.feature.properties[`GID_${activeLevel === 'region' ? '1' : activeLevel === 'department' ? '2' : '3'}`] === selectedLocation) {
          layer.setStyle({
            weight: 5,
            color: '#3498db',
            dashArray: '',
            fillOpacity: 0.7,
            className: 'pulsating-location'
          });
        }
      });
    }
  }, [selectedLocation, activeLevel]);

  const renderLocationDetails = () => {
    if (!selectedLocation) return null;

    const stats = mapService.getLocationStats(selectedLocation);
    if (!stats) return null;

    return (
      <IonCard className="location-details-card">
        <IonCardContent>
          <h2>{stats.name}</h2>
          <IonList>
            <IonItem>
              <IonLabel>Électeurs inscrits</IonLabel>
              <IonBadge slot="end">{stats.registeredVoters.toLocaleString()}</IonBadge>
            </IonItem>
            {stats.participation && (
              <IonItem>
                <IonLabel>Taux de participation</IonLabel>
                <IonBadge slot="end" color="success">{stats.participation}%</IonBadge>
              </IonItem>
            )}
            <IonItem lines="none">
              <IonLabel>Résultats</IonLabel>
            </IonItem>
            {stats.candidates.map(candidate => (
              <IonItem key={candidate.candidateId} className="candidate-result">
                <IonLabel>
                  <h3>{candidate.candidateName}</h3>
                  <p>{candidate.party}</p>
                </IonLabel>
                <IonBadge slot="end" color="primary">{candidate.percentage}%</IonBadge>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>
    );
  };

  return (
    <div className="electoral-map">
      <div className="map-controls">
        <IonSegment value={activeLevel} onIonChange={e => setActiveLevel(e.detail.value as any)}>
          <IonSegmentButton value="region">
            <IonLabel>Régions</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="department">
            <IonLabel>Départements</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="district">
            <IonLabel>Arrondissements</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <IonSegment value={activeLayer} onIonChange={e => setActiveLayer(e.detail.value as any)}>
          <IonSegmentButton value="general">
            <IonIcon icon={layers} />
          </IonSegmentButton>
          <IonSegmentButton value="participation">
            <IonIcon icon={statsChart} />
          </IonSegmentButton>
          <IonSegmentButton value="results">
            <IonIcon icon={informationCircle} />
          </IonSegmentButton>
        </IonSegment>
      </div>

      <MapContainer
        center={[7.3697, 12.3547]}
        zoom={6}
        className="map-container"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />
        <ReactGeoJSON
          key={`${activeLevel}-${activeLayer}`}
          data={convertGeoDataToFeatureCollection(mapService.getGeoData(activeLevel))}
          style={(feature) => {
            if (!feature) return defaultStyle;
            return getFeatureStyle(feature as Feature<Geometry, GeoJsonProperties>);
          }}
          onEachFeature={(feature, layer: L.Layer) => {
            layer.on({
              mouseover: (e) => {
                const target = e.target as L.Polyline;
                target.setStyle({
                  weight: 5,
                  color: '#666',
                  dashArray: '',
                  fillOpacity: 0.7
                });
              },
              mouseout: (e) => {
                const target = e.target as L.Polyline;
                target.setStyle(getFeatureStyle(feature as Feature<Geometry, GeoJsonProperties>));
              },
              click: (e) => {
                const target = e.target as L.Polyline;
                const id = feature.properties?.[`GID_${activeLevel === 'region' ? '1' : activeLevel === 'department' ? '2' : '3'}`];
                if (id) {
                  setSelectedLocation(id);
                  onRegionSelect(id);
                  const map = useMap();
                  if (target.getBounds && map) {
                    map.fitBounds(target.getBounds());
                  }
                }
              }
            });

            if (feature.properties) {
              const name = feature.properties[`NAME_${activeLevel === 'region' ? '1' : activeLevel === 'department' ? '2' : '3'}`];
              if (name) layer.bindPopup(name);
            }
          }}
        />
        <MapController />
      </MapContainer>

      <div className="map-legend">
        <h4>Légende</h4>
        {getLegendItems().map((item, index) => (
          <div key={index} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {selectedLocation && renderLocationDetails()}
    </div>
  );
};

export default ElectoralMap;