import { Core, Map } from "ktsuilib";
import { FeatureLike } from "ol/Feature";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import React, { useContext } from "react";

function withOpacity (color: string, opacity: number) {
  const opacityStr = '00' + opacity.toString(16);
  const paddedOpacity = opacityStr.substring(opacityStr.length - 2)
  return `${color}${paddedOpacity}`;
}

const LinesLayerWrapper = () => {
  const { lines, currentLine } = useContext(Core.LineContext)!;

  const getStyle = (feature: FeatureLike) => {
    const baseOpacity = currentLine != null ? 96 : 255;

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
              color: line?.color || 'white',
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
          // color:  withOpacity('black', line?.lineid === currentLine ? 255 : baseOpacity),
          color:  withOpacity(line?.color || '', line?.lineid === currentLine ? 255 : baseOpacity),
          width: 3,
        })
      });
    }
  }

  return (
    <Map.LinesLayer styleFunction={getStyle} />
  )
};

export default LinesLayerWrapper;