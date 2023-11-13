import { useContext, useEffect, useState } from "react";
import MapContext from "../contexts/MapContext";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Circle from "ol/style/Circle"
import Stroke from "ol/style/Stroke";
import Vector from "ol/source/Vector";
import { Feature } from "ol";
import { fromLonLat } from "ol/proj";
import { Point as OLPoint } from "ol/geom";
import axios from "axios";
import { Point as KTSPoint } from 'ktscore';


const FeatureLayer = ({ zIndex = 0 }) => {
  const [source, setSource] = useState<Vector | undefined>(undefined);
  const map = useContext(MapContext); 

  useEffect(() => {
    const src = new Vector();
    axios.get('http://localhost:8080/points').then((res) => {
      ((res.data) as KTSPoint[]).forEach(pt => {
        src.addFeature(new Feature(new OLPoint(fromLonLat([pt.lng, pt.lat]))));
      })
    });

    setSource(src);
  }, []);

  useEffect(() => {
    if (!map) return;

    const featureLayer = new VectorLayer({
      className: 'feature-layer',
      source,
      style: 
        new Style({
         image: new Circle({
          fill: new Fill({
            color: 'red'
          }),
          stroke: new Stroke({
            color: 'white',
          }),
          radius: 5,
        }),
      }),
    });
    map.addLayer(featureLayer);
    featureLayer.setZIndex(1);
    return () => {
      if (map) {
        map.removeLayer(featureLayer);
      }
    };
  }, [map]);

  return null;
};
export default FeatureLayer;