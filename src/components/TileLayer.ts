import { useContext, useEffect } from "react";
import MapContext from "../contexts/MapContext";
import MVT from 'ol/format/MVT';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from "ol/layer/VectorTile";

const TileLayer = ({ zIndex = 0 }) => {
  const map = useContext(MapContext); 

  useEffect(() => {
    if (!map) return;
    
    const tileLayer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url: 'http://localhost:8080/{z}/{x}/{y}.pbf',
      }),
    });
    map.addLayer(tileLayer);
    tileLayer.setZIndex(zIndex);
    return () => {
      if (map) {
        map.removeLayer(tileLayer);
      }
    };
  }, [map]);

  return null;
};
export default TileLayer;