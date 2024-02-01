import { Coordinate } from "ol/coordinate";


export default interface MapContextType {
  zoom: number
  center: Coordinate
  
  setZoom: (z: number) => void
  setCenter: (c: Coordinate) => void
}