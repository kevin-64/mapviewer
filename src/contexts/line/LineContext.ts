import { createContext } from "react";
import LineContextType from "./LineContextType";
const MapContext = createContext<LineContextType | undefined>(undefined);
export default MapContext;