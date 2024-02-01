import { createContext } from "react";
import { Map } from "ol";
const MapContext = createContext<Map | undefined>(undefined);
export default MapContext;