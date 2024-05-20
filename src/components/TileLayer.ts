import { useContext, useEffect, useState } from "react";
import MapContext from "../contexts/map/MapContext";
import MVT from 'ol/format/MVT';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from "ol/layer/VectorTile";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";

const TileLayer = ({ zIndex = 0 }) => {
  const [counter, setCounter] = useState(0);
  const map = useContext(MapContext); 

  useEffect(() => {
    if (!map) return;
    
    const tileLayer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url: 'http://localhost:8000/{z}/{x}/{y}.pbf',
      }),
      style: function (feature, resolution) {
        const properties = feature.getProperties();
        if (properties.class === 'motorway') {
          return [new Style({
            stroke: new Stroke({
              color: 'ad2518',
              width: 4
            }),
            zIndex: 0
          }), new Style({
            stroke: new Stroke({
              color: 'red',
              width: 3
            }),
            zIndex: 1
          })
        ]
        } else if (properties.class === 'rail' || properties.class === 'railway' || properties.class === 'bus') {
          return new Style({
            fill: new Fill({
              color: 'black'
            }),
            stroke: new Stroke({
              color: 'black'
            })
          })
        } else if (properties.class === 'primary' || properties.class === 'trunk') {
          return [new Style({
            stroke: new Stroke({
              color: '9c6513',
              width: 3
            }),
            zIndex: 0
          }),
          new Style({
            stroke: new Stroke({
              color: 'orange',
              width: 2
            }),
            zIndex: 1
          }),
        ]
        } else if (properties.class === 'secondary') {
          return new Style({
            fill: new Fill({
              color: 'yellow'
            }),
            stroke: new Stroke({
              color: 'yellow'
            })
          })
        } else if (properties.class === 'tertiary' || properties.class === 'minor' || properties.class === 'service') {
          return new Style({
            fill: new Fill({
              color: 'white'
            }),
            stroke: new Stroke({
              color: 'white'
            })
          })
        } else if (properties.class === 'path') {
          return new Style({

            fill: new Fill({
              color: '#eeeeee'
            }),
            stroke: new Stroke({
              color: '#eeeeee'
            })
          })
        } 
        else if (properties.class === 'town' || properties.class === 'city') {
          return new Style({
            text: new Text({
              font: '12px sans-serif',
              // backgroundStroke: new Stroke({
              //   color: 'black'
              // }),
              text: properties['name:latin'],
              fill: new Fill({
                color: 'black'
              })
            })
          })
        } 
        else if (properties.admin_level === 6) {
          return new Style({
            fill: new Fill({
              color: 'blue'
            }),
            stroke: new Stroke({
              color: 'blue'
            })
          })
        } else if (properties.layer === 'water' || properties.layer === 'waterway') {
          return new Style({
            fill: new Fill({
              color: '#2885d1'
            }),
            stroke: new Stroke({
              color: '#2885d1'
            })
          })
        } else if (properties.layer === 'landuse') {
          return new Style({
            fill: new Fill({
              color: '#dddddd'
            }),
            stroke: new Stroke({
              color: '#dddddd'
            })
          })
        } else if (properties.layer === 'building') {
          return new Style({
            fill: new Fill({
              color: '#bbbbbb'
            }),
            stroke: new Stroke({
              color: '#bbbbbb'
            })
          })
        } else if (properties.layer === 'landcover' || properties.layer === 'park') {
          return new Style({
            fill: new Fill({
              color: 'green'
            }),
            stroke: new Stroke({
              color: 'green'
            })
          })
        } else {
          if (counter < 100000) {
            //TODOK: handle other features
            // console.log(feature.getProperties());
            setCounter(counter + 1);
          }
          return new Style({
            stroke: new Stroke({
              color: 'blue'
            })
          })
        }
      },
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