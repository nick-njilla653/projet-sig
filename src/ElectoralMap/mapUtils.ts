// src/utils/mapUtils.ts
import { LatLngBounds, LatLng } from 'leaflet';
import { ElectionData } from './ElectoralMapService';

export const getParticipationColor = (participation: number): string => {
  if (!participation) return '#e0e0e0';
  if (participation >= 80) return '#1a9850';
  if (participation >= 60) return '#91cf60';
  if (participation >= 40) return '#d9ef8b';
  if (participation >= 20) return '#fee08b';
  return '#d73027';
};

export const getResultsColor = (results: ElectionData['results']): string => {
  if (!results || results.length === 0) return '#e0e0e0';
  const winner = results.reduce((prev, current) => 
    (prev.percentage > current.percentage) ? prev : current
  );
  
  // Couleurs par parti (à personnaliser selon vos besoins)
  const partyColors: {[key: string]: string} = {
    'party1': '#2166ac',
    'party2': '#d73027',
    'party3': '#1a9850',
    // Ajoutez d'autres partis selon vos besoins
  };
  
  return partyColors[winner.partyId] || '#e0e0e0';
};

export const calculateBounds = (features: any[]): LatLngBounds => {
  const bounds = new LatLngBounds([0, 0], [0, 0]);
  features.forEach(feature => {
    if (feature.geometry.coordinates) {
      feature.geometry.coordinates.forEach((polygon: number[][]) => {
        polygon.forEach((coord: number[]) => {
          bounds.extend(new LatLng(coord[1], coord[0]));
        });
      });
    }
  });
  return bounds;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

export const calculateParticipationStats = (features: any[]) => {
  const total = features.length;
  let participationSum = 0;
  let highest = 0;
  let lowest = 100;

  features.forEach(feature => {
    const participation = feature.properties.participation;
    participationSum += participation;
    highest = Math.max(highest, participation);
    lowest = Math.min(lowest, participation);
  });

  return {
    average: participationSum / total,
    highest,
    lowest
  };
};