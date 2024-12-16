// src/utils/geo-utils.ts
import { LatLngBounds, LatLng } from 'leaflet';
import { Position, Geometry } from 'geojson';
import { ElectoralFeature } from './geo-types';

export const calculateBoundsFromGeometry = (geometry: Geometry): LatLngBounds => {
  const bounds = new LatLngBounds([0, 0], [0, 0]);

  const addPositionToBounds = (position: Position) => {
    bounds.extend(new LatLng(position[1], position[0]));
  };

  const processCoordinates = (coordinates: Position[] | Position[][] | Position[][][]) => {
    coordinates.forEach(coord => {
      if (typeof coord[0] === 'number') {
        addPositionToBounds(coord as Position);
      } else if (Array.isArray(coord[0])) {
        processCoordinates(coord as Position[][] | Position[]);
      }
    });
  };

  switch (geometry.type) {
    case 'Point':
      addPositionToBounds(geometry.coordinates);
      break;
    case 'LineString':
    case 'MultiPoint':
      processCoordinates(geometry.coordinates);
      break;
    case 'Polygon':
    case 'MultiLineString':
      geometry.coordinates.forEach(line => processCoordinates(line));
      break;
    case 'MultiPolygon':
      geometry.coordinates.forEach(polygon => 
        polygon.forEach(line => processCoordinates(line))
      );
      break;
  }

  return bounds;
};

export const calculateFeatureBounds = (feature: ElectoralFeature): LatLngBounds | null => {
  if (!feature.geometry) {
    console.warn('Feature sans géométrie:', feature);
    return null;
  }
  return calculateBoundsFromGeometry(feature.geometry);
};