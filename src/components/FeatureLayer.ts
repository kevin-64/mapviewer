import { useContext, useEffect, useState } from "react";
import MapContext from "../contexts/map/MapContext";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Circle from "ol/style/Circle"
import Stroke from "ol/style/Stroke";
import Vector from "ol/source/Vector";
import { Feature } from "ol";
import { fromLonLat } from "ol/proj";
import { Point as OLPoint, LineString as OLLineString } from "ol/geom";
import LineContext from "../contexts/line/LineContext";
import { PointRecord } from "../contexts/line/LineContextType";

const ptToCoord = (pt: PointRecord) => {
  return fromLonLat([pt.lng, pt.lat]);
}

const ptToOLPoint = (pt: PointRecord) => {
  return new OLPoint(ptToCoord(pt));
}

const withOpacity = (color: string, opacity: number) => {
  const opacityStr = '00' + opacity.toString(16);
  const paddedOpacity = opacityStr.substring(opacityStr.length - 2)
  return `${color}${paddedOpacity}`;
}

const FeatureLayer = ({ zIndex = 0 }) => {
  const [source, setSource] = useState<Vector | undefined>(undefined);
  const { lines, currentLine } = useContext(LineContext)!;
  const map = useContext(MapContext); 

  useEffect(() => {
    const src = new Vector();
    setSource(src);
  }, []);

  useEffect(() => {
    if (!lines.length || !source) return;

    source.clear();

    const featuresToAdd: Feature[] = [];
    lines.forEach(ln => {
      ln.points.forEach((pt, index) => {

        if (ln.lineid === currentLine) {
          featuresToAdd.push(new Feature(ptToOLPoint(pt)));
        }
        
        if (index > 0) {
          const lineFeature = new Feature(new OLLineString([
            ptToCoord(ln.points[index - 1]), 
            ptToCoord(pt)
          ]));
          lineFeature.setProperties({ fName: ln.lineid })
          featuresToAdd.push(lineFeature);
        }
      });
    });
    source!.addFeatures(featuresToAdd);
  }, [lines.length, currentLine]);

  useEffect(() => {
    if (!map) return;

    const featureLayer = new VectorLayer({
      className: 'feature-layer',
      source,
      style: function(feature) {
        const fProps = feature.getProperties();
        if (!fProps.fName) {
          return new Style({
            image: new Circle({
              fill: new Fill({
                color: 'red'
              }),
              stroke: new Stroke({
                color: 'white',
              }),
              radius: 5,
            })
          });
        } else {
          const line = lines.find(ln => ln.lineid === fProps.fName);
          return new Style({
            stroke: new Stroke({
              color:  withOpacity(line?.color || '', line?.lineid === currentLine ? 255 : 128),
              width: 5,
            })
          })
        }
      }
    });
    map.addLayer(featureLayer);
    featureLayer.setZIndex(1);
    return () => {
      if (map) {
        map.removeLayer(featureLayer);
      }
    };
  }, [map, currentLine, lines.length]);

  return null;
};
export default FeatureLayer;