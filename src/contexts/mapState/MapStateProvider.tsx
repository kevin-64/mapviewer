import { Coordinate } from "ol/coordinate";
import React, { ReactElement, useMemo, useState } from "react";
import MapStateContextType from "./MapStateContextType";
import MapStateContext from "./MapStateContext";

interface MapProviderProps {
  startZoom: number
  startCenter: Coordinate
  children: ReactElement | ReactElement[]
}

const MapStateProvider = ({ children, startZoom, startCenter }: MapProviderProps) => {
  const [zoomLevel, setZoomLevel] = useState(startZoom);
  const [mapCenter, setMapCenter] = useState(startCenter);
  
  const mapProvider = useMemo<MapStateContextType>(() => {
    return {
      zoom: zoomLevel,
      center: mapCenter,
  
      setZoom: (z: number) => {
        setZoomLevel(z);
      },
  
      setCenter: (c: Coordinate) => {
        setMapCenter(c);
      }
    }
  }, [zoomLevel, mapCenter]);
  
  return (
    <MapStateContext.Provider value={mapProvider}>
      {children}
    </MapStateContext.Provider>
  )
}

export default MapStateProvider;
