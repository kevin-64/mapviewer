import { createContext } from "react";
import ViewContextType from "./ViewContextType";
const ViewContext = createContext<ViewContextType | undefined>(undefined);
export default ViewContext;