import React, { useRef, useState, useEffect, ReactElement } from "react"
import MapContext from "./MapContext";
import { Map, View } from "ol";
import { Coordinate } from "ol/coordinate";

interface MapProviderProps {
  zoom: number
  center: Coordinate
  children: ReactElement | ReactElement[]
}

const MapProvider = ({ children, zoom, center }: MapProviderProps) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState<Map | undefined>(undefined);

  useEffect(() => {
    let options = {
      view: new View({ zoom, center }),
      layers: [],
      controls: [],
      overlays: []
    };
    let mapObject = new Map(options);
    mapObject.setTarget(mapRef.current || undefined);
    setMap(mapObject);
    return () => mapObject.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (!map) return;

    map.getView().setZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    if (!map) return;
    
    map.getView().setCenter(center)
  }, [center]);
  
  return (
    <MapContext.Provider value={map}>
      <div ref={mapRef} className="ol-map">
        {children}
      </div>
    </MapContext.Provider>
  )
}
export default MapProvider;