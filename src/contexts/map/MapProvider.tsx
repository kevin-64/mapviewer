import React, { useRef, useState, useEffect, ReactElement } from "react"
import MapContext from "./MapContext";
import { Feature, Map, MapBrowserEvent, View } from "ol";
import { toLonLat } from 'ol/proj'
import { Coordinate } from "ol/coordinate";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";
import axios from "axios";

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
    mapObject.on('click', (e: MapBrowserEvent<any>) => {
      const lonLat = toLonLat(e.coordinate);
      console.log(lonLat);

      ;(mapObject.getAllLayers()
      .filter(l => l.getClassName() === 'feature-layer')[0] as VectorLayer<VectorSource>)!
      .getSource()!
      .addFeature(new Feature(new Point(e.coordinate)));
  
      axios.post('http://localhost:8080/points', {
        name: 'additional-point',
        lat: lonLat[1],
        lng: lonLat[0]
      }).then(resp => {
        console.log(resp);
      });
    });
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