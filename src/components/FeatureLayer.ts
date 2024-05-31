import { useContext, useEffect, useState } from "react";
import { MapContext } from 'ktsuilib';
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Circle from "ol/style/Circle"
import Stroke from "ol/style/Stroke";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { fromLonLat } from "ol/proj";
import { Point as OLPoint, LineString, Geometry } from "ol/geom";
import LineContext from "../contexts/line/LineContext";
import { PointRecord } from "../contexts/line/LineContextType";
import { Coordinate } from "ol/coordinate";

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
  const [source, setSource] = useState<VectorSource | undefined>(undefined);
  const { lines, currentLine } = useContext(LineContext)!;
  const map = useContext(MapContext); 

  useEffect(() => {
    const src = new VectorSource({});
    setSource(src);
  }, []);

  useEffect(() => {
    if (!lines.length || !source) return;

    source.clear();

    const featuresToAdd: Feature[] = [];
    lines.forEach(ln => {
      ln.points.forEach((pt, index) => {

        if (ln.lineid === currentLine) {
          const ptFeature = new Feature(ptToOLPoint(pt));
          ptFeature.setProperties({pLine: ln.lineid});
          featuresToAdd.push(ptFeature);
        }
      });

      ln.paths.forEach((path, pathIndex) => {
        const pathGeometry: Coordinate[] = [];

        path.points.forEach((pt, pointIndex) => {
          pathGeometry.push(ptToCoord(pt));
        });

        const pathFeature = new Feature(new LineString(pathGeometry));
        pathFeature.setProperties({ fName: ln.lineid });
        featuresToAdd.push(pathFeature);
      });
    });
    source!.addFeatures(featuresToAdd);
  }, [lines.length, currentLine]);

  useEffect(() => {
    if (!map) return;

    const baseOpacity = currentLine != null ? 96 : 255;
    const featureLayer = new VectorLayer({
      className: 'feature-layer',
      source: source as any,
      style: function(feature) {
        const fProps = feature.getProperties();
        if (fProps.pLine) {
          const line = lines.find(ln => ln.lineid === fProps.pLine);

          return [
            new Style({
              image: new Circle({
                fill: new Fill({
                  color: line?.color || ''
                }),
                stroke: new Stroke({
                  color: 'white',
                }),
                radius: 5,
              })
            }),
            new Style({
              image: new Circle({
                stroke: new Stroke({
                  color: 'black',
                }),
                radius: 6,
              })
            }),
          ];
        } else {
          const line = lines.find(ln => ln.lineid === fProps.fName);
          return new Style({
            stroke: new Stroke({
              color:  withOpacity(line?.color || '', line?.lineid === currentLine ? 255 : baseOpacity),
              width: 5,
            })
          });
        }
      }
    });
    featureLayer.getSource()?.addFeature(new Feature())
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