import { Map } from "ol";
import { createContext } from "react";
const MapContext = createContext<Map | undefined>(undefined);
export default MapContext;