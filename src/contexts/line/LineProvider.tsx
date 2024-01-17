import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import LineContextType, { LineRecord, PointRecord } from "./LineContextType";
import LineContext from './LineContext';
import axios from "axios";
import { Line } from "ktscore";

export default function LineProvider(props: PropsWithChildren) {
  const [selectedLine, setSelectedLine] = useState<number | undefined>(undefined);
  const [lines, setLines] = useState<Line[]>([]);

  const loadLines = () => {
    axios.get('http://localhost:8080/lines').then((res) => {
      setLines(res.data as Line[]);
     });
  }

  useEffect(() => {
    loadLines();
  }, []);

  const provider = useMemo<LineContextType>(() => {
    return {
      lines,
      currentLine: selectedLine,

      refreshLines: () => {
        loadLines();
      },

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
  }, [selectedLine, lines]);

  return (
    <LineContext.Provider value={provider}>
      {props.children}
    </LineContext.Provider>
  )
}