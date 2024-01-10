import React, { PropsWithChildren, useMemo, useState } from "react";
import LineContextType, { LineRecord, PointRecord } from "./LineContextType";
import LineContext from './LineContext';
import axios from "axios";

export default function LineProvider(props: PropsWithChildren) {
  const [selectedLine, setSelectedLine] = useState<number | undefined>(undefined);
  const provider = useMemo<LineContextType>(() => {
    return {
      lines: [],
      currentLine: selectedLine,

      addLine: (ln: LineRecord) => {
        axios.post('http://localhost:8080/lines', {
          ...ln
        }).then(resp => {
          console.log(resp);
        });
      },
      updateLine: (ln: LineRecord) => {},
      removeLine: (id: number) => {
        axios.delete(`http://localhost:8080/lines/${id}`).then(resp => {
          console.log(resp);
          if (selectedLine === id) setSelectedLine(undefined);
        });
      },

      setCurrentLine: (id?: number) => {
        setSelectedLine(id);
      },
      addPoint: (pt: PointRecord, pos: number) => {},
      removePoint: (pos: number) => {},
    }
  }, [selectedLine]);

  return (
    <LineContext.Provider value={provider}>
      {props.children}
    </LineContext.Provider>
  )
}