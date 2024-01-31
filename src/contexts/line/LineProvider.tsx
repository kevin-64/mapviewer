import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import LineContextType, { LinePointRecord, LineRecord, LineWithPoints } from "./LineContextType";
import LineContext from './LineContext';
import axios from "axios";
import { Line } from "ktscore";

export default function LineProvider(props: PropsWithChildren) {
  const [selectedLine, setSelectedLine] = useState<number | undefined>(undefined);
  const [poi, setPoi] = useState<number | undefined>(undefined);
  const [lines, setLines] = useState<LineWithPoints[]>([]);

  const loadLines = () => {
    axios.get('http://localhost:8080/lines').then((res) => {
      setLines(res.data as LineWithPoints[]);
     });
  }

  useEffect(() => {
    loadLines();
  }, []);

  const provider = useMemo<LineContextType>(() => {
    return {
      lines,
      currentLine: selectedLine,
      pointOfInsertion: poi,

      setPointOfInsertion: (p: number) => {
        setPoi(p);
      },

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
      updateLine: (ln: Line) => {
        axios.put(`http://localhost:8080/lines/${ln.lineid}`, {
          ...ln
        }).then(resp => {
          console.log(resp);
        });
      },
      removeLine: (id: number) => {
        axios.delete(`http://localhost:8080/lines/${id}`).then(resp => {
          console.log(resp);
          if (selectedLine === id) setSelectedLine(undefined);
        });
      },

      setCurrentLine: (id?: number) => {
        setSelectedLine(id);
        setPoi(lines.find(ln => ln.lineid === id)?.points.length);
      },
      addPoint: (pt: LinePointRecord) => {
        axios.post('http://localhost:8080/points', {
          ...pt,
        }).then(resp => {
          lines.find(ln => ln.lineid === pt.lineid)?.points.splice(pt.order, 0, pt);
          setSelectedLine(pt.lineid);
          console.log(resp);
        });
      },
      removePoint: (pos: number) => {},
    }
  }, [selectedLine, lines]);

  return (
    <LineContext.Provider value={provider}>
      {props.children}
    </LineContext.Provider>
  )
}