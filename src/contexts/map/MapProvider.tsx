import React, { useRef, useState, useEffect, ReactElement, useContext } from "react"
import MapContext from "./MapContext";
import { Map, MapBrowserEvent, View } from "ol";
import { toLonLat } from 'ol/proj'
import LineContext from "../line/LineContext";
import { ZoomSlider, Zoom } from 'ol/control';
import MapStateContext from "../mapState/MapStateContext";

interface MapProviderProps {
  children: ReactElement | ReactElement[]
}

const MapProvider = ({ children }: MapProviderProps) => {
  const mapRef = useRef(null);
  const { currentLine, setCurrentLine, currentPoint, lines, addPoint } = useContext(LineContext)!;
  const { zoom, center } = useContext(MapStateContext)!; 
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

    const zoomSlider = new ZoomSlider();
    mapObject.addControl(zoomSlider);

    const z = new Zoom();
    mapObject.addControl(z);

    setMap(mapObject);
    return () => mapObject.setTarget(undefined);
  }, []);

  useEffect(() => {
    const listener =  (e: MapBrowserEvent<any>) => {
      if (!currentLine) return; //only add points to the selected line

      const currLine = lines.find(ln => ln.lineid === currentLine)!;
      const lonLat = toLonLat(e.coordinate);

      console.log("used to decide order: ", currentPoint)

      addPoint({
        name: 'additional-point',
        lat: lonLat[1],
        lng: lonLat[0],
        lineid: currLine.lineid,
        direction: false as any,
        request: false,
        order: currentPoint !== undefined ? currentPoint : (currLine.points.length)
      });
      setCurrentLine(undefined);
    }
    map?.on('click', listener);
    return () => map?.un('click', listener);
  }, [map, currentLine, currentPoint]);

  useEffect(() => {
    if (!map) return;

    map.getView().setZoom(zoom);
  }, [map, zoom]);

  useEffect(() => {
    if (!map) return;
    
    map.getView().setCenter(center)
  }, [map, center]);
  
  return (
    <MapContext.Provider value={map}>
      <div ref={mapRef} className="ol-map">
        {children}
      </div>
    </MapContext.Provider>
  )
}
export default MapProvider;