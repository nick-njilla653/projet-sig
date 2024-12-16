// src/hooks/useMapControls.ts

import { useState, useCallback } from 'react';

export const useMapControls = () => {
  const [zoom, setZoom] = useState(6);
  const [center, setCenter] = useState<[number, number]>([7.3697, 12.3547]);
  const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleCenterChange = useCallback((newCenter: [number, number]) => {
    setCenter(newCenter);
  }, []);

  const handleBoundsChange = useCallback((newBounds: [[number, number], [number, number]]) => {
    setBounds(newBounds);
  }, []);

  return {
    zoom,
    center,
    bounds,
    handleZoomChange,
    handleCenterChange,
    handleBoundsChange
  };
};