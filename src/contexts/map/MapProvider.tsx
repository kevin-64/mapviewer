import React, { useRef, useState, useEffect, ReactElement, useContext } from "react"
import MapContext from "./MapContext";
import { Feature, Map, MapBrowserEvent, View } from "ol";
import { toLonLat } from 'ol/proj'
import { Coordinate } from "ol/coordinate";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";
import LineContext from "../line/LineContext";

interface MapProviderProps {
  zoom: number
  center: Coordinate
  children: ReactElement | ReactElement[]
}

const MapProvider = ({ children, zoom, center }: MapProviderProps) => {
  const mapRef = useRef(null);
  const { currentLine, setCurrentLine, lines, addPoint } = useContext(LineContext)!;
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
    const listener =  (e: MapBrowserEvent<any>) => {
      if (!currentLine) return; //only add points to the selected line

      const currLine = lines.find(ln => ln.lineid === currentLine)!;
      console.log(currLine);

      const lonLat = toLonLat(e.coordinate);
      console.log(lonLat);

      ;(map?.getAllLayers()
      .filter(l => l.getClassName() === 'feature-layer')[0] as VectorLayer<VectorSource>)!
      .getSource()!
      .addFeature(new Feature(new Point(e.coordinate)));
  
      addPoint({
        name: 'additional-point',
        lat: lonLat[1],
        lng: lonLat[0],
        lineid: currLine.lineid,
        direction: false as any, //TODO: allow deciding,
        request: false, //TODO: allow deciding
        order: currLine.points[currLine.points.length - 1].order + 1 //TODO: add anywhere);
      });
      setCurrentLine(undefined);
    }
    map?.on('click', listener);
    return () => map?.un('click', listener);
  }, [currentLine]);

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