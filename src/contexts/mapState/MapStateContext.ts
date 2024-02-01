import { createContext } from "react";
import MapStateContextType from "./MapStateContextType";
const MapStateContext = createContext<MapStateContextType | undefined>(undefined);
export default MapStateContext;